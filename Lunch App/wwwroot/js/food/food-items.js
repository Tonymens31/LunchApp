let saveOrUpdate = 0,
    selectedRow = "",
    btnState = 0,
    FoodItems = [],
    FoodItem = {},
    FoodTypes = [],
    Vendors = [],
    Vendor = {},
    sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    },
    mtTab;

$(document).ready(() => {
    init();
})

let init = () => {
    // Button click
    $('#foodModal').click(() => {
        createFoodItem();
    })

    // Load Food Items
    getFoodItems();

    // Load Food Types
    getFoodTypes();

    // get Vendors
    getVendors();
}

let createFoodItem = () => {
    FoodItem = {};

    $('#foodItemModal').modal('show');
    $("#save-food-item").css('cursor', 'not-allowed');
    $("#save-food-item").html(`<i class="fa fa-save"></i> Save`);

    $('#closeBtn').click(() => {
        clearFields();
        $('#foodItemModal').modal('hide');
    })

    $("#vendor, #foodItem, #foodType, #status").bind('change', () => {
        validateFoodItem();
    });
}

let editFoodItem = () => {
    $('#foodItemModal').modal('show');

    $('#foodItem').val(FoodItem.name);
    $('#foodType').val(FoodItem.typeId);
    $('#status').val(FoodItem.isActive);
    $('#vendor').val(FoodItem.vendorId);

    $("#save-food-item").html(`<i class="fa fa-save"></i> Update`);
    $("#save-food-item").prop('disabled', false);
    $("#save-food-item").css('cursor', 'pointer');

        $('#closeBtn').click(() => {
        FoodItem = {};
        clearFields();
        $('#foodItemModal').modal('hide');
    })
    $("#vendor, #foodItem, #foodType, #status").bind('change', () => {
        validateFoodItem();
    });
}


$("#save-food-item").click(() => {

    //console.log({ FoodItem });

    if (FoodItem && FoodItem.id) {

        //Edit Existing
        FoodItem.name = $("#foodItem").val();
        FoodItem.typeId = $("#foodType").val();
        FoodItem.vendorId = $("#vendor").val();
        FoodItem.isActive = $("#status").val();

        // Update Existing
        updateFoodItem();

    } else {

        // Create New
        FoodItem = {
            name: $("#foodItem").val(),
            typeId: $("#foodType").val(),
            vendorId: $("#vendor").val(),
            isActive: $("#status").val(),
        };
        // Create New
        saveFoodItem();

    }
})

let validateFoodItem = () => {
    let _foodItem = {
        name: $("#foodItem").val(),
        typeId: $("#foodType").val(),
        vendorId: $("#vendor").val(),
        isActive: $("#status").val(),
    };
    if (_foodItem && _foodItem.name && _foodItem.typeId && _foodItem.vendorId && _foodItem.isActive) {
        $("#save-food-item").prop('disabled', false);
        $("#save-food-item").css('cursor', 'pointer')
    } else {
        $("#save-food-item").prop('disabled', true);
        $("#save-food-item").css('cursor', 'not-allowed')
    }
}


let clearFields = () => {
    $('#foodItem').val("");
    $('#foodType').val(-1);
    $('#status').val(-1);
    $('#vendor').val(-1);
    $("#save-food-item").prop('disabled', true);
    $("#save-food-item").css('cursor', 'not-allowed');
}

let getFoodItems = () => {
    pageLoader("show");
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Foods/GetFoodItems`;
    pageLoader("hide");
    $.post(url, model).then(
        response => {
            // Process Response
            if (response.status == "Success") {
                FoodItems = response.body;
            }
            getDataTable();
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}


let getDataTable = () => {
    mtTab = $('#table').DataTable({
        data: FoodItems,
        pageLength: 10,
        destroy: true,
        searching: true,
        scrollY: '48vh',
        pagingType: "simple_numbers",
        className: "blue",
        fixedHeader: {
            header: true,
            headerOffset: $('#header').height()
        },
        responsive: true,
        columns: [
            {
                title: "FoodItem",
                data: "name",
                width: "28%"
            },
            {
                title: "Type",
                data: "type",
                width: "21%"
            },
            {
                title: "Vendor",
                data: "vendor",
                width: "30%"
            },
            {
                title: "Status",
                data: "isActive",
                render: function (data) {
                    return data === 1 ? `<button class="btn btn-success btn-sm">Active</button>` : `<button class="btn btn-sm btn-danger">Inactive</button>`;
                },
                width: "16%"
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
        FoodItem = FoodItems.filter(x => x.id === id)[0]
        // Show Modal
        if (FoodItem && FoodItem.id) {
            deleteFoodItem();
        }
    })
}

let setFoodTypes = () => {
    let template = `<option value="">Select Food Type</option>`
    template += FoodTypes.map(type => (
        `<option value = "${type.id}">${type.name}</option>`
    ))
    $("#foodType").html(template);
}

let ControlButtons = () => {

    // Edit button
    $(".editButton").click((el) => {
        let id = el.target.dataset.id;
        FoodItem = FoodItems.filter(x => x.id === id)[0]

        // Show Modal
        if (FoodItem && FoodItem.id) {
            // Show Modal
            editFoodItem();
        }
    })
}

let getFoodTypes = () => {
    let url = `${_path_url}api/Codes/GetAllCodes`;
    model = JSON.stringify({ Code: "ftyp" });
    $.post(url, model).then(
        response => {
            if (response.status == "Success") {
                setFoodTypes();
                FoodTypes = response.body;
            }
            setFoodTypes();
        },
        error => {
            console.log({ error });
        }
    )
}



let getVendors = () => {
    let url = `${_path_url}api/Vendors/GetAllVendors`;
    model = JSON.stringify({ Id: companyId });
    $.post(url, model).then(
        response => {
            if (response.status == "Success") {
                setFoodTypes();
                Vendors = response.body;
            }
            setVendors();
        },
        error => {
            console.log({ error });
        }
    )
}

let setVendors = () => {
    let template = `<option value="">Select Food Vendor</option>`
    template += Vendors.map(vendor => (
        `<option value = "${vendor.id}">${vendor.name}</option>`
    ))
    $("#vendor").html(template);
}

let saveFoodItem = () => {
    //console.log({ FoodItem });

    let foodItms = [];
    foodItms.push(FoodItem)
    let model = JSON.stringify(foodItms);
    let url = `${_path_url}api/Foods/CreateFoodItem/${companyId}`
    $.post(url, model).then(
        response => {
            console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Saved successfully',
                });
                resetFoodItems();
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


let resetFoodItems = () => {
    $('#foodItemModal').modal('hide');
    FoodItem = {};
    clearFields();
    getFoodItems();
}


let updateFoodItem = () => {
    let model = JSON.stringify(FoodItem);
    let url = `${_path_url}api/Foods/UpdateFoodItem/${companyId}`
    $.post(url, model).then(
        response => {
            //console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Updated successfully',
                });
                resetFoodItems();
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


let deleteFoodItem = () => {
    let url = `${_path_url}api/Foods/DeleteFoodItem/${FoodItem.id}/${companyId}`
    $.post(url).then(
        response => {
            //console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Deleted successfully',
                });
                resetFoodItems();
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