
$(document).ready(function () {
    btnState = 0;
    let sub = {
        1: { color: 'success', state: 'Active' },
        2: { color: 'danger', state: 'Inactive' }
    };

    $('#btnAddVendor').click(function () {
        btnState = 0
        $("#saveVendor").html(`<i class="fa fa-save"></i> Save`)
        $('#vendorModal').modal('show');
      
    });

    let vendorData = [
        {
            id: 1,
            vendorName: "Champion Dishes",
            phone1: "026 160 6467",
            vendorEmail: "championdishes@gmail.com",
            status: 1,
        },
        {
            id: 2,
            vendorName: "Tonymens International Dishes",
            phone1: "030 999 3336",
            vendorEmail: "tonyInterdi@gmail.com",
            status: 2
        },
        {
            id: 3,
            vendorName: "Michael Nartey's Typical Local Chopbar",
            phone1: "020 554 3331",
            vendorEmail: "micknartal@hotmail.org",
            status: 2
        },
        {
            id: 1,
            vendorName: "Champion Dishes",
            phone1: "026 160 6467",
            vendorEmail: "championdishes@gmail.com",
            status: 1,
        },
        {
            id: 2,
            vendorName: "Tonymens International Dishes",
            phone1: "030 999 3336",
            vendorEmail: "tonyInterdi@gmail.com",
            status: 2
        },
        {
            id: 3,
            vendorName: "Michael Nartey's Typical Local Chopbar",
            phone1: "020 554 3331",
            vendorEmail: "micknartal@hotmail.org",
            status: 2
        }
    ];

    loadVendorData();

    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })

    function loadVendorData() {

        let view = ``;

        vendorData = [...new Map(vendorData.map(item => [item.id, item])).values()];


        vendorData.map(item => {
            view += `<tr id=${item.id} >
                            <td>${item.vendorName}</td>
                            <td>${item.phone1.replace(/\s+/g, '')}</td>
                            <td>${item.vendorEmail}</td>
                            <td>
                                <span class="badge badge-dot mr-4" style="background-color:transparent; padding: 0px;">
                                <i class="bg-${item.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[item.status].color} btn-sm" disabled>${sub[item.status].state}</span>
                            </span>
                           </td>
                           <td class="">
                                <a href="#" class="text-inverse editButton"  id="${item.id}"   title="Edit"><i class="fas fa-edit fa-1x"></i></a>
                              
                           </td>
                        </tr>
                    `
        })
        $('#vendorTable').html(view);
        bindButtonsToDOM() 
    }

    $("#saveVendor").click(() => {
        vendorList();
        validation();
        iziToast.success({
            position: 'topRight',
            message: 'Vendor saved successfully',
        });
        //message('success', 'Vendor added sucessfully ');
    })

    function vendorList() {
        let formdata = {
            id: uuidv4(),
            vendorName: $("#vendorName").val(),
            phone1: $("#phone1").val(),
            phone2: $("#phone2").val(),
            vendorEmail: $("#vendorEmail").val(),
            status: parseInt($("#status").val())
        }
        console.log(formdata);

        vendorData.push(formdata)
        loadVendorData();
        $('#vendorModal').modal('hide');
        clearFields()
        

    }

    //function addToTable(data) {
    //    let { vendorName, phone1, phone2, vendorEmail, status } = data;
    //    //let tem = `<tr id="">
    //    //            <td>${vendorName}</td>
    //    //            <td>${phone1}</td>
    //    //            <td>${phone2}</td>
    //    //            <td>${vendorEmail}</td>
    //    //            <td>${status}</td>
    //    //        </tr>`;

    //    //$('#vendorTable').prepend(tem);
    //    $('#vendorModal').modal('hide');
    //}

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
                btnState = 1
                $("#saveVendor").html(`Update`)
                $('#vendorModal').modal('show');
               
            });
        }
    }

    function getRowData(rowId) {
        let data = vendorData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
        // saveOrUpdate = 1;
    }

    function populateInputFields(data) {
        console.log(data)
        let = { vendorName, phone1, phone2, vendorEmail, status } = data;
        //console.log(foodItem); console.log(type); console.log(status)

        $('#vendorName').val(vendorName)
        $('#phone1').val(phone1)
        $('#phone2').val(phone2)
        $('#vendorEmail').val(vendorEmail)
        $('#status').val(status)
        $('#vendorModal').modal('show');
        $("btnAddVendor").html(`Update`)

    };

    function clearFields() {
        $('#vendorName').val("")
        $('#phone1').val("")
        $('#phone2').val("")
        $('#vendorEmail').val("")
        $('#status').val(-1)
    }


    function uuidv4() {
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

    $('#search').click(() => {

    })

    $("#saveVendor").css('cursor', 'not-allowed');
    function validation() {
        $("#vendorName").val().length !== 0 &&
            $("#phone1").val().length !== 0 &&
            $("#vendorEmail").val().length !== 0 &&
            $("#status").val() > 0 ?
            ($("#saveVendor").prop('disabled', false), $("#saveVendor").css('cursor', 'pointer')) :
            ($("#saveVendor").prop('disabled', true), $("#saveVendor").css('cursor', 'not-allowed'))
    }

    function NoEmptyField(data) {
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
   
});

