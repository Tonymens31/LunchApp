$(document).ready(function () {
    btnState = 0;
    let Vendors = [];
    let selectedRow = "";
    let saveOrUpdate = 0;
    let sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    };


    $.LoadingOverlay("show", {

        progressFixedPosition: screenTop,
        progress: true
    });

    // Hide it after 3 seconds
    setTimeout(function () {
        $.LoadingOverlay("hide");
    }, 3000);


    $('#btnAddVendor').click(function () {
        btnState = 0
        $("#saveVendor").html(`<i class="fa fa-save"></i> Save`)
        $('#vendorModal').modal('show');
    });


    $("#table").on('click', '.deleteButton', '.transfer-input-check', function (event) {
        $(this).parents('tr').detach();
    });

    //get all vendors
    let loadVendors = () => {
        pageLoader("show");
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}api/Vendors/GetAllVendors`, data)
            .done(function (data) {
               let JsonArray = JSON.parse(data)
                //data = JSON.parse(data.Body)
                Vendors = JsonArray.Body;
                loadDataTable();
            }
            );
        pageLoader("hide");
    };
    loadVendors();


    $(document).on("click", ".editButton", function () {
        saveOrUpdate = 1;
        let rowid = $(this).val();
        let rowData = Vendors.filter(x => x.id === rowid)[0]
        selectedRow = rowData.id;
        populateInputFields(rowData);
        $("#saveVendor").html(`Update`)
    });


    //$('#table').DataTable();
    let loadDataTable = () => {
        $('#table').DataTable({
            data: Vendors,
            searching: true,
            destroy: true,
            scrollY: '50vh',
            pagingType: "simple_numbers",
            className: "blue",
            fixedHeader: {
                header: true,
                headerOffset: $('#header').height()
            },
            responsive: true,
            columns: [
                {
                    title: "Vendor Name",
                    data: "name",
                    width: "25%"
                },
                {
                    title: "Email",
                    data: "email",
                    width: "35%"
                },
                {
                    title: "Phone №",
                    data: "phone",
                    width: "20%"
                },
                {
                    title: "Status",
                    data: "isActive",
                    render: function (data) {
                        return data === 1 ? `<button class="btn btn-success btn-sm">Active</button>` : `<button class="btn btn-sm btn-danger">Inactive</button>`;
                    },
                    width: "15%"
                },
                {
                    data: "id",
                    title: "Actions", render: function (data) {
                        return `<button style="border:none; background:transparent" class="editButton" value="${data}"><i class="fas fa-edit text-info"></i></button> 
                                <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        `;
                    },
                    width: "5%"
                }
            ]
        });
    }


    //get GetAllVendorWithFoodItems/{companyId}
    let VendorsWithFoodItems = () => {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}GetAllVendorWithFoodItems`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                console.log(data);

            }
        );
    }


    //GetSingleVendors/{pkId}/{companyId}
    let loadSingleVendor = () => {
        let data = { companyId: companyId, pkId: pkId };
        makeAPIRequest(`${_path_url}GetSingleVendors`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                console.log(data);
            }
            );
    };

    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })



    let bindButtonsToDOM = (data) => {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(data, this.id)
                btnState = 1
                $("#saveVendor").html(`Update`)
                $('#vendorModal').modal('show');

            });
        }
    };

    let populateInputFields = (data1) => {
        let = { name, phone, tel, email, isActive } = data1;
        
        $('#vendorName').val(name)
        $('#phone1').val(phone)
        $('#phone2').val(tel)
        $('#vendorEmail').val(email)
        $('#status').val(isActive)
        $('#vendorModal').modal('show');
        $("btnAddVendor").html(`Update`)

    };

    let clearFields = () => {
        $('#vendorName').val("")
        $('#phone1').val("")
        $('#phone2').val("")
        $('#vendorEmail').val("")
        $('#status').val(-1)
    }

    $('#close').on('click', function () {

        $('#vendorName').val("")
        $('#phone1').val("")
        $('#phone2').val("")
        $('#vendorEmail').val("")
        $('#status').val(-1)
    });

    let uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    var userSelection = document.getElementsByClassName('required');

    for (var i = 0; i < userSelection.length; i++) {
        (function (index) {
            userSelection[index].addEventListener("input", function () {
                let el = userSelection[index].id;

                let inputel = document.getElementById(el);
                inputel.value ? (inputel.style.border = "1px solid #ced4da", validation()) : (inputel.style.border = "1px solid red", validation(), inputel.focus())
            })
        })(i);
    }

    $("#saveVendor").css('cursor', 'not-allowed');
    let validation = () => {
        $("#vendorName").val().length !== 0 &&
            $("#phone1").val().length !== 0 &&
            $("#vendorEmail").val().length !== 0 &&
            $("#status").val().length > -1 ?
            ($("#saveVendor").prop('disabled', false).css('cursor', 'pointer')) :
            ($("#saveVendor").prop('disabled', true).css('cursor', 'not-allowed'))
    }

    let NoEmptyField = (data) => {
        if (data != "") {
            return !null;
        }
    }
    emailAddress = document.getElementById("vendorEmail")
    emailAddress.addEventListener('input', () => {
        NoEmptyField(emailAddress.value) ? validateEmail(emailAddress.value) ?
            (emailAddress.style.border = "1px solid #e1e5ef") :
            (emailAddress.style.border = "1px solid red", emailAddress.focus()) :
            (emailAddress.style.border = "1px solid red", emailAddress.focus());
    })

    emailAddress.addEventListener('focusout', () => {
        NoEmptyField(emailAddress.value) ? validateEmail(emailAddress.value) ?
            (emailAddress.style.border = "1px solid #e1e5ef") :
            (emailAddress.style.border = "1px solid red", emailAddress.focus()) :
            (emailAddress.style.border = "1px solid red", emailAddress.focus());
    })



    let phoneNumber = document.getElementById("phone1")
    phoneNumber.addEventListener('input', () => {
        NoEmptyField(phoneNumber.value) ? validatePhone(phoneNumber.value) ?
            (phoneNumber.style.border = "1px solid #e1e5ef") :
            (phoneNumber.style.border = "1px solid red", phoneNumber.focus()) :
            (phoneNumber.style.border = "1px solid red", phoneNumber.focus());
    })

    phoneNumber.addEventListener('focusout', () => {
        NoEmptyField(phoneNumber.value) ? validatePhone(phoneNumber.value) ?

            (phoneNumber.style.border = "1px solid #e1e5ef") :
            (phoneNumber.style.border = "1px solid red", phoneNumber.focus()) :
            (phoneNumber.style.border = "1px solid red", phoneNumber.focus());
    })


    $("#phone1").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((Number(evt.which) !== 46 || Number(self.val().indexOf('.')) !== -1) && (evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });

    $("#phone1").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^\d].+/, ""));
        if ((evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });

    $("#phone2").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((Number(evt.which) !== 46 || Number(self.val().indexOf('.')) !== -1) && (evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });

    $("#phone2").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^\d].+/, ""));
        if ((evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });



    $("#saveVendor").click(() => {
        let postDatasArr = [];
        let formdata = {
            "pkId": "00000000-0000-0000-0000-000000000000",
            "name": $("#vendorName").val(),
            "email": $("#vendorEmail").val(),
            "phone": $("#phone1").val(),
            "tel": $("#phone2").val(),
            "isActive": parseInt($("#status").val()),
            "companyId": '00000000-0000-0000-0000-000000000000'
        }

        if (saveOrUpdate === 0) {
            postDatasArr.push(formdata);
            createVendor(`${_path_url}APICalls/PostVendor`, postDatasArr)
        } else {
            formdata.pkId = selectedRow;
            updateVendor(`${_path_url}APICalls/PutVendor`, formdata)
        }

        loadVendors();
        iziToast.success({
            position: 'topRight',
            message: 'Saved successfully',
        });

        $('#vendorModal').modal('hide');
    })


    let createVendor = (url, data) => {
        makeAPIRequest(url, data)
            .done(function (response) {
            });
    }

    let updateVendor = (url, data) => {
        makeAPIRequest(url, data)
            .done(function (response) {
            });
    }
});

