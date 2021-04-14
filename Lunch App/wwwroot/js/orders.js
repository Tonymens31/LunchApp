
let saveOrUpdate = 0,
    selectedRow = "",
    btnState = 0,
    Orders = [],
    Order = {},
    SelectedDate  = "",
    mtTab;



$(document).ready(() => {
    init();
})

let init = () => {

    //Button click
    $('#btnAddOrder').click(function () {
        Order = {};
        showModal();
    });

   

    //load Orders
    getOrders();

    //getAllMenuByDate();
}


let dt = new DateHandler();
btnState = 0;
fmtDate = (s) => {
    let d = new Date(Date.parse(s));
    let fmt = d.toUTCString().replace("00:00:00", "")
    return fmt.replace("GMT", "")
}




$('#btnAddOrder').click(function () {
    btnState = 0
    $("#saveOrder").html(`<i class="fa fa-save"></i> Save`)

})

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
}, 200);

//$('#table').DataTable();
let getDataTable = () => {
    console.log({ Orders });

    mtTab = $('#table').DataTable({
        data: Orders,
        pageLength: 10,
        destroy: true,
        searching: true,
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
                title: "Date",
                data: "orderDate",
                render: function (data) {
                    return getFormattedDate(data);
                },
            },
            {
                title: "Name ",
                data: "orderedBy"
            },
            {
                title: "Main Dish",
                data: "mainDish"
            },
            {
                title: "Side Dish",
                data: "sideDish"
            },
            {
                title: "Condiment",
                data: "condiDish"
            },
            {
                title: "Price",
                data: "price",
                render: function (data) {
                    return moneyInTxt(data, "en", 2);
                },
            }

            //{
            //    data: "id",
            //    title: "Actions", render: function (data) {
            //        return `
            //            <button style="border:none; background:transparent" class="editButton" data-id="${data}">
            //                <i class="fas fa-edit text-info" data-id=${data}></i>
            //            </button> 
            //        `
            //            //<button style="border:none; background:transparent" class="deleteButton" data-id=${data}>
            //            //    <i class="fas fa-trash text-danger" data-id=${data}></i>
            //            //</a>
            //            ;
            //    }
            //},
        ]
    });
    ControlButtons();
    $(".paginate_button").click(() => {
        ControlButtons();
    });
}


let createOrders = () => {
    Order = {};

    $('#OrderModal').modal('show');
  
    $("#saveOrder").html(`<i class="fa fa-save"></i> Save`);

    $('#closeBtn').click(() => {
        Order = {};
        clearFields();
        $('#OrderModal').modal('hide');
    })
   

    $("#name, #orderMainDish, #orderSideDish, #orderDate").bind('change', () => {
        validateOrders();
    });

    $("#saveOrder").css('cursor', 'not-allowed');
}


$("#orderDate").change(function () {
  
    SelectedDate = $("#orderDate").val();
    getAllMenuByDate();
    $("#name").prop("disabled", false);
    $("#orderMainDish").prop("disabled", false);
    $("#orderSideDish").prop("disabled", false);
    $("#orderCondiment").prop("disabled", false);
});

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

$("#saveOrder").click(() => {

    if (Order && Order.id) {

        //Edit Existing
        Order.name = $("#name").val();
        Order.mainDishId = $("#orderMainDish").val();
        Order.sideDishId = $("#orderSideDish").val();
        Order.condiDishId = $("#orderCondiment").val();
        Order.orderDate = $("#orderDate").val();

        // Update Existing
        updateOrder();

    } else {

        // Create New
        Order = {
            name: $("#name").val(),
            mainDishId: $("#orderMainDish").val(),
            sideDishId: $("#orderSideDish").val(),
            condiDishId: $("#orderCondiment").val(),
            orderDate: $("#orderDate").val(),
        };
        // Create New
        saveOrder();

    }
});



let validateOrders = () => {
    let _Order = {
        name: $("#name").val(),
        mainDishId: $("#orderMainDish").val(),
        sideDishId: $("#orderSideDish").val(),
        orderDate: $("#orderDate").val(),
    };
    if (_Order && _Order.name && _Order.mainDishId && _Order.sideDishId && _Order.orderDate) {
        $("#saveOrder").prop('disabled', false);
        $("#saveOrder").css('cursor', 'pointer')
    } else {
        $("#saveOrder").prop('disabled', true);
        $("#saveOrder").css('cursor', 'not-allowed')
    }
}



//function validateOrders() {
//    console.log($("#name").val())
//    if ($("#orderMainDish").val() > -1 &&
//        $("#orderSideDish").val() > -1 
//     ) {
//        console.log('Accra')
//        $('#saveOrder').prop('disabled', false)
//    } else {
//        console.log('Kumasi')
//        $('#saveOrder').prop('disabled', true);
//    }
//}


//$('.transfer-input-check').on('keyup change', function () {
//    validateOrders();
//});



let clearFields = () => {
    $('#name').val("");
    $('#orderMainDish').val(-1);
    $('#orderSideDish').val(-1);
    $('#orderCondiment').val(-1);
    $('#orderDate').val(-1);
    $("#saveOrder").prop('disabled', true);
    $("#saveOrder").css('cursor', 'not-allowed');
}

let resetOrders = () => {
    $('#OrderModal').modal('hide');
    Order = {};
    clearFields();
    getOrders();
}


//get all orders
let getOrders = () => {
    let model = JSON.stringify({ Id: companyId });
    let url = `${_path_url}api/Order/GetOrders`;
    $.post(url, model).then(
        response => {
            // Process Response
            if (response.status == "Success") {
                Orders = response.body;
            }
           // console.log({ Orders })

            $("#count").text(Orders.length)

            getDataTable();
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}


let setMenuType = (data, title, htmlElementId) => {
    let template = `<option value="-1">${title}</option>`
    template += data.map(menu => (
        `<option value = "${menu.id}">${menu.name}</option>`
    ))
    $(htmlElementId).html(template);
}



let getAllMenuByDate = () => {
    let model = JSON.stringify({ companyId: companyId, Date: SelectedDate });
    let url = `${_path_url}api/Order/GetAllByDate`;
    $.post(url, model).then(
        response => {
            console.log({ response })
            if (response.status == "Success") {
                Menus = response.body.mainDish;
                setMenuType(response.body.mainDish, "Select main dish", "#orderMainDish");
                setMenuType(response.body.sideDish, "Select side dish", "#orderSideDish");
                setMenuType(response.body.condiDish, "Select condiment", "#orderCondiment");
            };
        },
        error => {
            // debug error
            console.log({ error });
        }
    )
}


let showModal = () => {
    if (Order && Order.id) {
        $("#saveOrder").html(`<i class="fa fa-save"></i> Update`);
    } else {
        $("#saveOrder").html(`<i class="fa fa-save"></i> Save`);
    }

    $('#orderModal').modal('show');

    $('#closeBtn').click(function () {
        Order = {};
        clearFields();
       
        $('#orderModal').modal('hide');
    })
}

flatpickr('#orderdate', {
    "minDate": new Date().fp_incr(1),
    "dateFormat": "d-m-Y",
    "disable": [
        function (date) {
            // return true to disable
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    "locale": {
        "firstDayOfWeek": 1 // start week on Monday
    }
});



$("#saveOrder").click(() => {
    orderFood();
    ValidateOrder();
    iziToast.success({
        position: 'topRight',
        message: 'Order saved successfully',
    });
    $("#name").prop('disabled', true)
    $('#orderingForField').hide()
    // message('success', 'Order added sucessfully ');
})


let saveOrder = () => {
    //console.log({ FoodItem });

    let foodOrder = [];
    foodOrder.push(Order)
    let model = JSON.stringify(foodOrder);
    let url = `${_path_url}api/Orders/CreateOrder/${companyId}`
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

let updateOrder = () => {
    let model = JSON.stringify(Order);
    let url = `${_path_url}api/Orders/UpdateOrder/${companyId}`
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
