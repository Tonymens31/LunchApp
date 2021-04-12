$(document).ready(function () {
    let sub = {
        1: { color: 'success', state: 'Active' },
        2: { color: 'danger', state: 'Inactive' }
    };

    $('#btnAddStaff').click(function () {
        btnState = 0;
        $("#saveStaff").html(`<i class="fa fa-save"></i> Save`)
        $('#staffModal').modal('show');
    })

    //$('#table').DataTable();
    function loadDataTable() {
        $('#staffTable').DataTable({
            // data: data,
            searching: true,
            scrollY: '48vh',
            destroy: true,
            pagingType: "simple_numbers",
            className: "blue",
            fixedHeader: {
                header: true,
                headerOffset: $('#header').height()
            },
            responsive: true,
            columns: [
                {
                    title: "Staff ID",
                    //data: "name",
                    width: "15%"

                },
                {
                    title: "Name",
                    //data: "email",
                    width: "23%"
                },
                {
                    title: "Email",
                    //data: "email",
                    width: "30%"
                },
                {
                    title: "Phone",
                    //data: "phone",
                    width: "15%"
                },
                {
                    title: "Status",
                    //data: "phone",
                    width: "15%"
                },

                {
                    // data: "id",
                    title: "Actions",
                    //render: function (data) {
                    //    return `<button style="border:none; background:transparent" class="editButton" value="${data}"><i class="fas fa-edit text-info"></i></button> 
                    //            <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                    //    `;
                    //},
                    width: "3%"
                }
            ]
        });

    }


    //get all vendors

    function loadVendors() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}APICalls/GetAllVendors`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                loadDataTable(data);
                //if (data) {
                //    createVendorTable(data, '#vendorTable');
                //}
            });
    };
    loadVendors();


    function LoadStaffData() {
        let template = ``;
        staffData = [...new Map(staffData.map(item => [item.id, item])).values()]

        staffData.map(item => {
            template += `<tr id="${item.id}">
                            <td>${item.staffId}</td>
                            <td>${item.name}</td>
                            <td>${item.email}</td>
                            <td>${item.phone}</td>
                            <td>
                            <span class="badge badge-dot mr-4" style="background-color:transparent;padding: 0px;">
                                <i class="bg-${item.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[item.status].color} btn-sm" disabled>${sub[item.status].state}</span>
                            </span>
                        </td>
                        <td class="">
                            <a href="#" class="text-inverse editButton" id="${item.id}" title="Edit"><i class="fas fa-edit"></i></a>
                            <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                        </tr>`
        })

        $("#staffTable").html(template)
        bindButtonsToDOM();
    }

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
                btnState = 1
                $("#saveStaff").html(`Update`)
                $('#staffModal').modal('show');
            });
        }
    }

    function getRowData(rowId) {
        let data = staffData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
        // saveOrUpdate = 1;
    }

    function populateInputFields(data) {
        let = { staffId, name, email, phone, status } = data;
        //console.log(foodItem); console.log(type); 
        console.log(staffId)
        $('#staffMemID').val(staffId)
        $('#name').val(name)
        $('#email').val(email)
        $('#phone').val(phone)
        $('#status').val(status)
        $('#staffModal').modal('show');
    };

    $("#saveStaff").click(() => {
        staffList();
        validation();
        iziToast.success({
            position: 'topRight',
            message: 'staff saved successfully',
        });
        // message('success', 'Staff added sucessfully ');
    })

    $('#closeBtn').click(function () {
        clearFields()
        validation()
    })

    function staffList() {
        let formData = {
            id: uuidv4(),
            staffId: $("#staffMemID").val(),
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            status: $("#status").val()
        }

        console.log(formData)
        staffData.push(formData)
        LoadStaffData()
        $('#staffModal').modal('hide');
        clearFields()
    }

    function clearFields() {
        $('#staffMemID').val("")
        $('#name').val("")
        $('#email').val("")
        $('#phone').val("")
        $('#status').val(-1)
    }
    //    function addToTable(data) {
    //        let { date, maindish, sidedish, condiment, beverage } = data;
    //        let tem = `<tr id="">
    //                    <td>${date}</td>
    //                    <td>${maindish}</td>
    //                    <td>${sidedish}</td>
    //                    <td>${condiment}</td>
    //                    <td>${beverage}</td>
    //                </tr>`;

    //        $('#orderTable').prepend(tem);
    //        $('#staffModal').modal('hide');
    //    }

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

    $("#saveStaff").css('cursor', 'not-allowed');
    function validation() {
        $("#staffMemID").val().length !== 0 &&
            $("#name").val().length !== 0 &&
            $("#email").val().length !== 0 &&
            $("#phone").val().length !== 0 &&
            $("#status").val() > 0 ?
            ($("#saveStaff").prop('disabled', false), $("#saveStaff").css('cursor', 'pointer')) :
            ($("#saveStaff").prop('disabled', true), $("#saveStaff").css('cursor', 'not-allowed'))
    }

    function NoEmptyField(data) {
        if (data != "") {
            return !null;
        }

    }
    emailAddress = document.getElementById("email")

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


    let phoneNumber = document.getElementById("phone")

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


    $("#phone").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((Number(evt.which) !== 46 || Number(self.val().indexOf('.')) !== -1) && (evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });

    $("#phone").on("keypress", function (evt) {
        var self = $(this);
        self.val(self.val().replace(/[^\d].+/, ""));
        if ((evt.which < 48 || evt.which > 57)) {
            evt.preventDefault();
        }
    });



});

