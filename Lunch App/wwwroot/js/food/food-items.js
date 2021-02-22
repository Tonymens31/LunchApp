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
        showFoodModal();
    })

    // Load Foo Items
    getFoodItems();

    // Edit button
    $(document).on("click", ".editButton", function () {
        editFoodItem();
    })

    // Load Food Types
    getFoodTypes();

    // get Vendors
    getVendors();

    $(document).on("click", ".editButton", function () {
        editFunction();
    })
}

let showFoodModal = () => {
    $("#saveFoodItem").html(`<i class="fa fa-save"></i> Save`);
    $('#foodItemModal').modal('show');

    $('#closeBtn').click(() => {
        clearFields();
        $('#foodItemModal').modal('hide');
    })

    $("#vendor, #foodItem, #foodType, #status").bind('change', () => {
        validation();
    });

    $("#saveFoodItem").css('cursor', 'not-allowed');


    $("#saveFoodItem").click(() => {
        saveFoodItem();
    })
}

let validation = () => {
    FoodItem = {
        Name: $("#foodItem").val(),
        TypeId: $("#foodType").val(),
        VendorId: $("#vendor").val(),
        IsActive: $("#status").val(),
    };
    if (FoodItem && FoodItem.Name && FoodItem.TypeId && FoodItem.VendorId && FoodItem.IsActive) {
        $("#saveFoodItem").prop('disabled', false);
        $("#saveFoodItem").css('cursor', 'pointer')
    } else {
        $("#saveFoodItem").prop('disabled', true);
        $("#saveFoodItem").css('cursor', 'not-allowed')
    }
}


let clearFields = () => {
    $('#foodItem').val("");
    $('#foodType').val(-1);
    $('#status').val(-1);
    $('#vendor').val(-1);
    $("#saveFoodItem").prop('disabled', true);
    $("#saveFoodItem").css('cursor', 'not-allowed');
}

let getFoodItems = () => {
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Foods/GetFoodItems`;
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
                    return `<button style="border:none; background:transparent" class="editButton" value="${data}"><i class="fas fa-edit text-info"></i></button> 
                                <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        `;
                },
                width: "5%"
            },
        ]
    });
}

let editFoodItem = () => {
    saveOrUpdate = 1;
    let rowid = $(this).val();
    let rowData = FoodItems.filter(x => x.id === rowid)[0]
    selectedRow = rowData.id;
    populateInputFields(rowData);

    $("#saveFoodItem").html(`Update`)
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

let setFoodTypes = () => {
    let template = `<option value="">Select Food Type</option>`
    template += FoodTypes.map(type => (
        `<option value = "${type.id}">${type.name}</option>`
    ))
    $("#foodType").html(template);
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


    let editFunction = () => {
        saveOrUpdate = 1;
        let rowid = $(this).val();
        let rowData = FoodItems.filter(x => x.id === rowid)[0]
        selectedRow = rowData.id;
        populateInputFields(rowData);

        $("#saveFoodItem").html(`Update`)
    }
   





let resetFoodItems = () => {
    $('#foodItemModal').modal('hide');

    clearFields();
    getFoodItems();
}


let updateFoodItem = () => {

}