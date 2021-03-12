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


let populateInputFields = () => {
    $('#menuDate').val(Menu.startAt);
    $('#menuMainDish').val(Menu.mainDishId);
    $('#menuSideDish').val(Menu.sideDishId);
    $('#menuCondiment').val(Menu.condiDishId);
    $('#expiryDate').val(Menu.endAt);
    $('#price').val(Menu.price);

    //show modal
    showMenuModal();
};



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
            mainDishId: $("#menuMainDish").val(),
            sideDishId: $("#menuSideDish").val(),
            condiDishId: $('#menuCondiment').val(),
            price: $("#price").val(),
            endAt: $("#expiryDate").val(),
        };
    }
    if (Menu && Menu.startAt && Menu.mainDishId && Menu.sideDishId && Menu.price && Menu.endAt) {
        ($("#saveMenu").prop('disabled', false),
            $("#saveMenu").css('cursor', 'pointer'))
    } else {
        ($("#saveMenu").prop('disabled', true),
            $("#saveMenu").css('cursor', 'not-allowed'))
    }
}

let clearFields = () => {
    $('#menuDate').val("")
    $('#menuMainDish').val("")
    $('#menuCondiment').val(-1)
    $('#expiryDate').val("")
    $('#price').val("")
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
                console.log({ Menus})
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


let ControlButtons = () => {
    // Edit button
    $(".editButton").click((el) => {
        //alert('hiiiii')
        let id = el.target.dataset.id;
        Menu = Menus.filter(x => x.id === id)[0]
        console.log(Menu)
        if (Menu && Menu.id) {
            populateInputFields();
        }
    })

    // Delete Button
    $(".deleteButton").click((el) => {
        console.log({ el });
        let id = el.target.dataset.id;
        Menu = Menus.filter(menu => menu.id === id)[0]
        // Show Modal
        if (Menu && Menu.id) {
            deleteMenu();
        }
    })
}

let setMenuTypes = (data, title, htmlElementId) => {
    let template = `<option value="">${title}</option>`
    template += data.map(menu => (
        `<option value = "${menu.id}">${menu.name}</option>`
    ))
    $(htmlElementId).html(template);
}



let getDataTable = () => {
    mtTab = $('#table').DataTable({
        data: Menus,
        searching: true,
        destroy: true,
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
                render: function (data) {
                    return moneyInTxt(data);
                },
                width: "2%"
            },
            {
                title: "Order Ending",
                data: "endAt",
                render: function (data) {
                    return getFormattedDate(data);
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


    ControlButtons();

    $(".paginate_button").click(() => {
        ControlButtons();
    })
}



let menuTime = () => {
    flatpickr('#menuDate', {
        "minDate": new Date().fp_incr(1),
        altFormat: "F j, Y",
        dateFormat: "d-m-Y",
        "disable": [
            function (date) {
                //return true to disable
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        "locale": {
            "firstDayOfWeek": 1 // start week on Monday
        }
    });mouth 
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




let resetMenus = () => {
    $('#menuModal').modal('hide');
    clearFields();
    getMenus();
}

let updateMenu = () => {
    let model = JSON.stringify(Menu);
    let url = `${_path_url}api/Menu/UpdateMenu/${companyId}`
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

