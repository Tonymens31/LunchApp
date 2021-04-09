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
        createMenu();
    })
    getMenus();
    getAllFoodInCat();
}

$.LoadingOverlay("show", {
    background: "white",
    progress: true,
    progressFixedPosition: "top"
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
}, 300);

// Hide it after 3 seconds
setTimeout(function () {
    $.LoadingOverlay("hide");
}, 3000);


let createMenu = () => {
    Menu = {};

    $("#saveMenu").html(`<i class="fa fa-save"></i> Save`);

    orderEnds();

    menuTime();

    $('#menuModal').modal('show');

    $('#closeBtn').click(() => {
        Menu = {};
        clearFields();
        $('#menuModal').modal('hide');

    })

    $("#menuDate, #menuMainDish, #menuSideDish, #expiryDate, #price").bind('change', () => {
        validateMenu();
    });

    $("#saveMenu").css('cursor', 'not-allowed');

}

let editMenu = () => {
    let dateTime = Menu.startAt.split("T")[0];
    $('#menuDate').val(Menu.startAt.split("T")[0]);
    $('#menuMainDish').val(Menu.mainDishId);
    $('#menuSideDish').val(Menu.sideDishId);
    $('#menuCondiment').val(Menu.condiDishId);
    $('#expiryDate').val(Menu.endAt);
    $('#price').val(Menu.price);

    $("#saveMenu").html(`<i class="fa fa-save"></i> Update`);

    orderEnds();

    menuTime();

    $('#menuModal').modal('show');

    $('#closeBtn').click(() => {
        Menu = {};
        clearFields();
        $('#menuModal').modal('hide');

    })

    $("#menuDate, #menuMainDish, #menuSideDish, #expiryDate, #price").bind('change', () => {
        validateMenu();
    });

    $("#saveMenu").css('cursor', 'not-allowed');
}


$("#saveMenu").click(() => {
    if (Menu && Menu.id) {
        //Collect
        Menu.startAt = $("#menuDate").val();
        Menu.sideDish = $("#menuSideDish").val();
        Menu.mainDish = $("#menuMainDish").val();
        Menu.price = $("#price").val();
        Menu.condiDish = $('#menuCondiment').val();
        Menu.endAt = $("#expiryDate").val();

        // Update Existing
        controlDateValues();
        updateMenu();
    } else {
        //Collect
        Menu = {
            startAt: $("#menuDate").val(),
            mainDishId: $("#menuMainDish").val(),
            sideDishId: $("#menuSideDish").val(),
            condiDishId: $('#menuCondiment').val(),
            price: $("#price").val(),
            endAt: $("#expiryDate").val(),
        };
        // Create New
        controlDateValues();
        saveMenu();
    }
})

let controlDateValues = () => {
    // Manipulate [Menu.startAt] & [Menu.endAt]
    let start_dates = Menu.startAt.split("-");
    Menu.startAt = `${start_dates[2]}-${start_dates[1]}-${start_dates[0]}T00:00:00`;

    let ends = Menu.endAt.split(" ");
    let end_dates = ends[0].split("-");
    Menu.endAt = `${end_dates[2]}-${end_dates[1]}-${end_dates[0]}T${ends[1]}:00`;

    if (!Menu.condiDishId) {
        Menu.condiDishId = '00000000-0000-0000-0000-000000000000';
    }
    console.log({ Menu });
}


let validateMenu = () => {
    let _menu = {
        startAt: $("#menuDate").val(),
        mainDishId: $("#menuMainDish").val(),
        sideDishId: $("#menuSideDish").val(),
        condiDishId: $('#menuCondiment').val(),
        price: $("#price").val(),
        endAt: $("#expiryDate").val(),
    };
    if (_menu && _menu.startAt && _menu.mainDishId && _menu.sideDishId && _menu.price && _menu.endAt) {
        ($("#saveMenu").prop('disabled', false),
            $("#saveMenu").css('cursor', 'pointer'))
    } else {
        ($("#saveMenu").prop('disabled', true),
            $("#saveMenu").css('cursor', 'not-allowed'))
    }
}

let clearFields = () => {
    $('#menuDate').val(-1)
    $('#menuMainDish').val(-1)
    $("#menuSideDish").val(-1),
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
               //console.log({ Menus })
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
        //console.log({ Menus });
        //console.log({ id });

        Menu = Menus.filter(x => x.id == id)[0]
        //console.log(Menu)
        if (Menu && Menu.id) {
            editMenu();
           
        }
    })

    // Delete Button
    $(".deleteButton").click((el) => {
        //console.log({ el });
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
                    return moneyInTxt(data, "en", 2);
                },
                width: "2%"
            },
            {
                title: "Order Ending",
                data: "endAt",
                render: function (data) {
                    return getFormattedDateTime(data);
                },
                width: "22%"
            },
            {
                data: "id",
                title: "Actions", render: function (val) {
                    return `
                        <button style="border:none; background:transparent" class="editButton" data-id="${val}">
                            <i class="fas fa-edit text-info" data-id=${val}></i>
                        </button> 
                        <button style="border:none; background:transparent" class="deleteButton" data-id=${val}>
                            <i class="fas fa-trash text-danger" data-id=${val}></i>
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
        "minDate": new Date().fp_incr(0),
        "altFormat": "F j, Y",
        "dateFormat": "d-m-Y",
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
        "minDate": new Date().fp_incr(0),
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
            //console.log({ response });
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





let deleteMenu = () => {
    let url = `${_path_url}api/Menu/DeleteMenu/${Menu.id}/${companyId}`
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

