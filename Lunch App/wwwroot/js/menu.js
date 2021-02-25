let mtTab;
btnState = 0;
let selectedRow = "";
let saveOrUpdate = 0;
let Menus = [];
let Menu = {};
let dt = new DateHandler();


$(document).ready(function () {
    inIt();
});


let inIt = () => {
    $('#btnAddMenu').click(() => {
        Menu = {};
        showMenuModal();
    })

    getMenus();

    getAllFoodInCat();



}

fmtDate = (s) => {
    let d = new Date(Date.parse(s));
    let fmt = d.toUTCString().replace("00:00:00", "")
    return fmt.replace("GMT", "")
}


let getMenus = () => {
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Menu/GetAllMenus`;
    $.post(url, model).then(
        response => {
            // Process Response
            if (response.status == "Success") {
                Menus = response.body;
            }
            getDataTable();
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}

let getAllFoodInCat = () => {
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Menu/GetAllFoodInCats`;
    $.post(url, model).then(
        response => {
            if (response.status == "Success") {

                Menus = response.body.mainDish;
                setMenuTypes(response.body.mainDish, "Select main dish", "#menuMainDish");
                setMenuTypes(response.body.sideDish, "Select side dish", "#menuSideDish");
                setMenuTypes(response.body.condiDish, "Select condiment", "#menuCondiment");
            }

            setMenuTypes();
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}


let setMenuTypes = (data, title, htmlElementId) => {
    let template = `<option value="">${title}</option>`
    template += data.map(menu => (
        `<option value = "${menu.id}">${menu.name}</option>`
    ))
    $(htmlElementId).html(template);
}
//function loadMenus() {
//    let data = { companyId: companyId };
//    makeAPIRequest(`${_path_url}Menu/GetAllMenus`, data)
//        .done(function (data) {
//            data = JSON.parse(data);
//            data = JSON.parse(data.Body);
//            Menus = data;
//            loadDataTable(data);
//        });
//}
//loadMenus();

//function loadMenusByCat() {
//    let data = { CompanyId: CompanyId };
//    makeAPIRequest(`${_path_url}Menu/GetAllFoodItemsInCat`, data)
//        .done(function (data) {
//            data = JSON.parse(data);
//            data = JSON.parse(data.Body);
//        });
//}

//$("#table").on('click', '.deleteButton', '.transfer-input-check', function (event) {
//    $(this).parents('tr').detach();
//});


//console.log(loadMenusByCat);
let showMenuModal = () => {
    if (Menu && Menu.id) {
        $("#saveMenu").html(`<i class="fa fa-save"></i> Update`);
    } else {
        $("#saveMenu").html(`<i class="fa fa-save"></i> Save`);
    }

    orderEnds();

    menuTime();

    $('#menuModal').modal('show');

    $('#closeBtn').click(() => {
        clearFields();
        $('#menuModal').modal('hide');

    })

    $("#menuDate, #menuMainDish, #menuSideDish, #expiryDate, #price").bind('change', () => {
        validation();
    });

    $("#saveMenu").css('cursor', 'not-allowed');

    $("#saveMenu").click(() => {
        if (Menu && Menu.id) {
            // Update Existing
            updateMenu();
        } else {
            // Create New
            saveMenu();
        }
    })

}

let getDataTable = () => {
    mtTab = $('#table').DataTable({
        data: Menus,
        searching: true,
        destroy: true,
        scrollY: '45vh',
        pagingType: "simple_numbers",
        className: "blue",
        fixedHeader: {
            header: true,
            headerOffset: $('#header').height()
        },
        responsive: true,
        columns: [
            {
                title: "Date",
                data: "startAt",
                render: function (data) {
                    return getFormattedDate(data);
                },
                width: "17%"
            },
            {
                title: "Main Dish",
                data: "mainDish",
                width: "27%"
            },
            {
                title: "Side Dish",
                data: "sideDish",
                width: "15%"
            },
            {
                title: "Condiment",
                data: "condiDish",
                width: "15%"
            },
            {
                title: "Pricing",
                data: "price",
                width: "2%"
            },
            {
                title: "Order Ending",
                data: "endAt",
                render: function (data) {
                    return fmtDate(data);
                },
                width: "22%"
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
                width: "2%"
            },
        ]
    });
}

/**   "mainDishId": "491e5a01-2218-411d-b8b3-a91c83ba68df",
    "sideDishId": "ef0c9c1f-6709-4065-854d-2b7b9f2258e3",
    "condiDishId": "00000000-0000-0000-0000-000000000000",
    "price": 4,
    "startAt": "2021-03-02T10:00:00.022Z",
    "endAt": "2021-03-03T10:00:00.022Z" */


//function setGeneric(data, title, elementID) {
//    let template = `<option value = "">${title}</option>`
//    template += data.map(type => (
//        `<option value = "${type.id}">${type.name}</option>`
//    ))
//    $(elementID).html(template);
//}

let menuTime = () => {
    flatpickr('#menuDate', {
        "minDate": new Date().fp_incr(1),
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        "disable": [
            function (date) {
                //return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        "locale": {
            "firstDayOfWeek": 1 // start week on Monday
        }
    });
}

let orderEnds = () => {
    flatpickr('#expiryDate', {
        "minDate": new Date().fp_incr(1),
        "enableTime": true,
        "dateFormat": "d-m-Y H:i",
        "disable": [
            function (date) {
                //return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        "locale": {
            "firstDayOfWeek": 1 // start week on Monday
        }
    });

}


//$( "#myselect option:selected" ).text();



//}




let clearFields = () => {
    $('#menuDate').val("")
    $('#menuMainDish').val("")
    $('#menuCondiment').val(-1)
    $('#expiryDate').val("")
    $('#price').val("")
}


let populateInputFields = () => {
    $('#menuDate').val(Menu.startAt);
    $('#menuMainDish').val(Menu.mainDish);
    $('#menuSideDish').val(Menu.sideDish);
    $('#menuCondiment').val(Menu.condiDish);
    $('#expiryDate').val(Menu.endAt);
    $('#price').val(Menu.price);

    //show modal
    showMenuModal();
};
//$('#closeBtn').click(function () {
//    clearFields();
//    validation();
//})


let validation = () => {
    //Edit Existing
    if (Menu && Menu.id) {
        Menu.startAt = $("#menuDate").val();
        Menu.sideDish = $("#menuSideDish").val();
        Menu.mainDish = $("#menuMainDish").val();
        Menu.price = $("#price").val();
        Menu.condiDish = $('#menuCondiment').val();
        Menu.endAt = $("#expiryDate").val();
    }
    else {
        //create new
        Menu = {
            startAt: $("#menuDate").val(),
            mainDish: $("#menuMainDish").val(),
            sideDish: $("#menuSideDish").val(),
            condiDish: $('#menuCondiment').val(),
            price: $("#price").val(),
            endAt: $("#expiryDate").val(),
        };
    }
    if (Menu && Menu.startAt && Menu.sideDish && Menu.mainDish && Menu.price && Menu.endAt) {
        ($("#saveMenu").prop('disabled', false),
            $("#saveMenu").css('cursor', 'pointer'))
    } else {
        ($("#saveMenu").prop('disabled', true),
            $("#saveMenu").css('cursor', 'not-allowed'))
    }
}


let ControlButtons = () => {
    // Edit button
    $(".editButton").click((el) => {
        let id = el.target.dataset.id;
        Menu = Menus.filter(x => x.id === id)[0]
        // Show Modal
        if (Menu && Menu.id) {
            populateInputFields();
        }
    })

    // Delete Button
    $(".deleteButton").click((el) => {
        console.log({ el });
        let id = el.target.dataset.id;
        Menu = Menus.filter(x => x.id === id)[0]
        // Show Modal
        if (Menu && Menu.id) {
            deleteFoodItem();
        }
    })
}


let updateMenu = () => {
    let model = JSON.stringify(FoodItem);
    let url = `${_path_url}api/Menus/UpdateMenu/${companyId}`
    $.post(url, model).then(
        response => {
            console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Updated successfully',
                });
                resetMenus();
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

let saveMenu = () => {
    //console.log({ Menu });

    let theMenu = [];
    theMenu.push(Menu)
    let model = JSON.stringify(theMenu);
    let url = `${_path_url}api/Menu/CreateMenu/${companyId}`
    $.post(url, model).then(
        response => {
            console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Saved successfully',
                });
                resetMenus();
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


let resetMenus = () => {
    $('#menuModal').modal('hide');
    clearFields();
    getMenus();
}


let deleteMenus = () => {
    let url = `${_path_url}api/Menu/DeleteFoodItem/${FoodItem.id}/${companyId}`
    $.post(url).then(
        response => {
            console.log({ response });
            if (response.status == "Success") {
                iziToast.success({
                    position: 'topRight',
                    message: 'Deleted successfully',
                });
                resetMenus();
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

