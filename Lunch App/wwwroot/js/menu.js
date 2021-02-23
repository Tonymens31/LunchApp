let mtTab;
btnState = 0;
let selectedRow = "";
let saveOrUpdate = 0;
let Menus = [];
let Menu = {};
let dt = new DateHandler();
//fmtDate = (s) => {
//    let d = new Date(Date.parse(s));
//    return d.toUTCString().replace("GMT", "")
//}


$(document).ready(function () {
    inIt();
});


let inIt = () => {
    $('#btnAddMenu').click(() => {
        Menu = {};
        showMenuModal();
    })

    getMenus();

}

fmtDate = (s) => {
    let d = new Date(Date.parse(s));
    let fmt = d.toUTCString().replace("00:00:00", "")
    return fmt.replace("GMT", "")
}

//$('#btnAddMenu').click(function () {
//    btnState = 0;
//    $("#saveMenu").html(`<i class="fa fa-save"></i> Save`)
//    $('#menuModal').modal('show');
//})

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

    $('#menuModal').modal('show');

    $('#closeBtn').click(() => {
        clearFields();
        $('#menuModal').modal('hide');
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

//$(document).on('click', '.editButton', function () {
//    let rowId = $(this).val();
//    let rowData = Menus.filter(x => x.id === rowId)[0];
//    console.log(rowId)
//    populateInputFields(rowData);
//})

//$(document).on("keyup", ".editButton", function () {
//    saveOrUpdate = 1;
//    let rowid = $(this).val();
//    let rowData = Vendors.filter(x => x.id === rowid)[0]
//    selectedRow = rowData.id;
//    populateInputFields(rowData);
//    $("#saveVendor").html(`Update`)
//})

//function loadSingleTypes() {
//    let data = { type: "ftyp" };
//    makeAPIRequest(`${_path_url}Menu/GetSingleCode`, data)
//        .done(function (data) {

//            data = JSON.parse(data)
//            data = JSON.parse(data.Body)

//            setGeneric(data, "Select Food Type", "#foodType")
//        });
//}
//loadSingleTypes(); 

//function setGeneric(data, title, elementID) {
//    let template = `<option value = "">${title}</option>`
//    template += data.map(type => (
//        `<option value = "${type.id}">${type.name}</option>`
//    ))
//    $(elementID).html(template);
//}

//flatpickr('#menuDate', {
//    "minDate": new Date().fp_incr(1),
//    "dateFormat": "d-m-Y",
//    "disable": [
//        function (date) {
//             return true to disable
//            return (date.getDay() === 0 || date.getDay() === 6);
//        }
//    ],
//    "locale": {
//        "firstDayOfWeek": 1 // start week on Monday
//    }
//});

//flatpickr('#expiryDate', {
//    "minDate": new Date().fp_incr(1),
//    "enableTime": true,
//    "dateFormat": "d-m-Y H:i",
//    "disable": [
//        function (date) {
//             return true to disable
//            return (date.getDay() === 0 || date.getDay() === 6);
//        }
//    ],
//    "locale": {
//        "firstDayOfWeek": 1 // start week on Monday
//    }
//});


//$( "#myselect option:selected" ).text();



//"mainDish": "Palmnut Soup with Goat Meat",
//    "sideDish": "Banku",
//        "condiDish": "Extra Banku",
//            "startAt": "2021-02-16T13:58:09.313",
//                "endAt": "2021-02-16T13:58:09.313",
//                    "createdAt"

//function MenuFood() {
//    let formData = {
//        id: uuidv4(),
//        date: 
//        maindish: ,
//        sidedish:
//        condiment: 
//        expiryDate: 
//        price:moneyInTxt($("#price").val(),"en",2)
//    }
//    console.log(formData)

//    menuData.push(formData)
//    loadMenus()

//}

//$("#expiryDate").change(function () {})

//function bindButtonsToDOM() {
//    let elements = document.getElementsByClassName('editButton');

//    for (let x = 0; x < elements.length; x++) {
//        elements[x].addEventListener('click', function (e) {
//            getRowData(this.id)
//            btnState = 1
//            $("#saveMenu").html(`Update`)
//            $('#menuModal').modal('show');
//        });
//    }
//}

//var userSelection = document.getElementsByClassName('required');

//for (var i = 0; i < userSelection.length; i++) {
//    (function (index) {
//        userSelection[index].addEventListener("input", function () {
//            let el = userSelection[index].id;

//            let inputel = document.getElementById(el);
//            inputel.value ? (inputel.style.border = "1px solid #ced4da", validation()) : (inputel.style.border = "1px solid red", validation(), inputel.focus())
//        })
//    })(i);
//}

//function getRowData(rowId) {
//    let data = menuData.filter(ele => ele.id.toString() === rowId)[0];
//    populateInputFields(data);
//     saveOrUpdate = 1;
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


$("#saveMenu").css('cursor', 'not-allowed');
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
        FoodItem = FoodItems.filter(x => x.id === id)[0]
        // Show Modal
        if (FoodItem && FoodItem.id) {
            populateInputFields();
        }
    })

    // Delete Button
    $(".deleteButton").click((el) => {
        console.log({ el });
        let id = el.target.dataset.id;
        FoodItem = FoodItems.filter(x => x.id === id)[0]
        // Show Modal
        if (FoodItem && FoodItem.id) {
            deleteFoodItem();
        }
    })
}


    //$("#saveMenu").click(() => {
    //    let postDatasArr = [];
    //    let formdata = {
    //        "startAt": $("#menuDate").val(),
    //        "mainDishId": $("#menuMainDish").val(),
    //        "sideDishId": $("#menuSideDish").val(),
    //        "condiDishId": $("#menuCondiment").val(),
    //        "price": $("#price").val(),
    //        "endAt": $("#expiryDate").val(),
    //        "companyId": '00000000-0000-0000-0000-000000000000'
    //    }
    //    console.log(formdata)
    //    if (saveOrUpdate == 1) {
    //        updateMenu(`${_path_url}Menu/PutMenu`, formdata);
    //    } else {
    //        postDatasArr.push(formdata);
    //        createMenu(`${_path_url}Menu/PostMenu`, postDatasArr);
    //    }
    //    $('#menuModal').modal('hide');
    //    clearFields()

    //});


    //function createMenu(url, data) {
    //    makeAPIRequest(url, data)
    //        .done(function (response) {
    //            console.log({response})
    //        });
    //}

    //function updateMenu(url, data) {
    //    makeAPIRequest(url, data)
    //        .done(function (response) {
    //        });
    //}
