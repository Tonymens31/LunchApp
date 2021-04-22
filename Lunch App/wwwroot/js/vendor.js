
let saveOrUpdate = 0,
    selectedRow = "",
    btnState = 0,
    FoodVendors = [],
    FoodVendor = {},
    sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    },
    mtTab;
$(document).ready(() => {
    inInt();
});

let inInt = () => {
    // Button click
    $('#btnAddVendor').click(() => {
        createVendor();
    })
    // Load Vendors
    getVendors();

}


let createVendor = () => {
    FoodVendor = {};

    $('#vendorModal').modal('show');
    $("#saveVendor").css('cursor', 'not-allowed');
    $("#saveVendor").html(`<i class="fa fa-save"></i> Save`);

    $('#closeBtn').click(() => {
        clearFields();
        $('#vendorModal').modal('hide');
    })

    $("#vendorName, #phone1, #vendorEmail, #status").bind('change', () => {
        validateFoodVendor();
    });
}

// Progress
$.LoadingOverlay("show", {
    progressFixedPosition: "top",
    //progress: true
});
var count = 0;
var interval = setInterval(function () {
    if (count >= 100) {
        clearInterval(interval);
        $.LoadingOverlay("hide");
        return;
    }
    count += 10;
    $.LoadingOverlay("progress", count);
}, 150);



let loadDataTable = () => {
    mtTab = $('#table').DataTable({
        data: FoodVendors,
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
                    return `
                        <button style="border:none; background:transparent" class="editButton" data-id="${data}">
                            <i class="fas fa-edit text-info" data-id=${data}></i>
                        </button> 
                        <button style="border:none; background:transparent" class="deleteButton" data-id=${data}>
                            <i class="fas fa-trash text-danger" data-id=${data}></i>
                        </a>
                        `;
                },
                width: "5%"
            },
        ]
    });

    ControlButtons();
    $(".paginate_button").click(() => {
        ControlButtons();
    })


    // Delete Button
    $(".deleteButton").click((el) => {
        //console.log({ el });
        let id = el.target.dataset.id;
        FoodVendor = FoodVendors.filter(x => x.id === id)[0]
        // Show Modal
        if (FoodVendor && FoodVendor.id) {
            deleteVendor();
        }
    })
}



$("#saveVendor").click(() => {

    if (FoodVendor && FoodVendor.id) {

        //Edit Existing
        FoodVendor.name = $("#vendorName").val();
        FoodVendor.email = $("#vendorEmail").val();
        FoodVendor.phone = $("#phone1").val();
        FoodVendor.isActive = $("#status").val();

        // Update Existing
        updateFoodVendor();

    } else {

        // Create New
        FoodVendor = {
            name: $("#vendorName").val(),
            email: $("#vendorEmail").val(),
            phone: $("#phone1").val(),
            isActive: $("#status").val(),
        };
        // Create New
        saveFoodVendor();
    }
});

let validateFoodVendor = () => {
    let _vendor = {
        name: $("#vendorName").val(),
        email: $("#vendorEmail").val(),
        phone: $("#phone1").val(),
        isActive: $("#status").val(),
    };
    if (_vendor && _vendor.name && _vendor.email && _vendor.phone && _vendor.isActive) {
        $("#saveVendor").prop('disabled', false);
        $("#saveVendor").css('cursor', 'pointer')
    } else {
        $("#saveVendor").prop('disabled', true);
        $("#saveVendor").css('cursor', 'not-allowed')
    }
}


let ControlButtons = () => {

    // Edit button
    $(".editButton").click((el) => {
        let id = el.target.dataset.id;
        FoodVendor = FoodVendors.filter(x => x.id == id)[0]

        // Show Modal
        if (FoodVendor && FoodVendor.id) {
            // Show Modal
            editFoodVendor();
        }
    })
}


let editFoodVendor = () => {
    $('#vendorModal').modal('show');

    $('#vendorName').val(FoodVendor.name);
    $('#vendorEmail').val(FoodVendor.email);
    $('#phone1').val(FoodVendor.phone);
    $('#status').val(FoodVendor.isActive);

    $("#saveVendor").html(`<i class="fa fa-save"></i> Update`);
    $("#saveVendor").prop('disabled', false);
    $("#saveVendor").css('cursor', 'pointer');

    $('#closeBtn').click(() => {
        FoodVendor = {};
        clearFields();
        $('#vendorModal').modal('hide');
    })
    $("#vendorName, #vendorEmail, #phone1, #status").bind('change', () => {
        validateFoodVendor();
    });
}



let getVendors = () => {
    pageLoader("show");
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Vendors/GetAllVendors`;
    pageLoader("hide");
    $.post(url, model).then(
        response => {
            // Process Response
            if (response.status == "Success") {
                FoodVendors = response.body;
                console.log(FoodVendors)
            }
            loadDataTable();
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}

let saveFoodVendor = () => {
    let vendors = [];
    vendors.push(FoodVendor)
    let model = JSON.stringify(vendors);
    let url = `${_path_url}api/Vendors/CreateFoodVendor/${companyId}`
    $.post(url, model).then(
        response => {
            console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Saved successfully',
                });
                resetFoodVendors();
            } else {
                iziToast.success({
                    position: 'topRight',
                    message: `Failure: ${response.caption}`,
                });
            }
        },
        error => {

            iziToast.error({
                position: 'topRight',
                message: 'Operation failed',
            });
        }
    )
}

let updateFoodVendor = () => {
    let model = JSON.stringify(FoodVendor);
    let url = `${_path_url}api/Vendors/UpdateFoodVendor/${companyId}`
    $.post(url, model).then(
        response => {
            //console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Updated successfully',
                });
                resetFoodVendors();
            } else {
                iziToast.success({
                    position: 'topRight',
                    message: `Failure: ${response.caption}`,
                });
            }
        },
        error => {
            // console.log({ error });
            iziToast.error({
                position: 'topRight',
                message: 'Operation failed',
            });
        }
    )
}

let deleteVendor = () => {
    let url = `${_path_url}api/Vendors/DeleteFoodVendor/${FoodVendor.id}/${companyId}`
    $.post(url).then(
        response => {
            //console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Deleted successfully',
                });
                resetFoodVendors();
            } else {
                iziToast.success({
                    position: 'topRight',
                    message: `Failure: ${response.caption}`,
                });
            }
        },
        error => {
            console.log({ error });
            iziToast.error({
                position: 'topRight',
                message: 'Operation failed',
            });
        }
    )
}

let resetFoodVendors = () => {
    $('#vendorModal').modal('hide');
    FoodVendor = {};
    clearFields();
    getVendors();
}


let clearFields = () => {
    $('#vendorName').val("")
    $('#phone1').val("")
    $('#vendorEmail').val("")
    $('#status').val(-1)
    $("#saveVendor").prop('disabled', true);
    $("#saveVendor").css('cursor', 'not-allowed');
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



