
let saveOrUpdate = 0,
    selectedRow = "",
    btnState = 0,
    Orders = [],
    Order = {},
    mtTab;



$(document).ready(() => {
    init();
})

let init = () => {

    //Button click
    $('#btnAddOrder').click(function () {
        Order = {};
        showModal();
    })

    //load Orders
    getOrders();
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
            },

            {
                data: "id",
                title: "Actions", render: function (data) {
                    return `
                        <button style="border:none; background:transparent" class="editButton" data-id="${data}">
                            <i class="fas fa-edit text-info" data-id=${data}></i>
                        </button> 
                    `
                        //<button style="border:none; background:transparent" class="deleteButton" data-id=${data}>
                        //    <i class="fas fa-trash text-danger" data-id=${data}></i>
                        //</a>
                        ;
                }
            },
        ]
    });
    ControlButtons();
    $(".paginate_button").click(() => {
        ControlButtons();
    });
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
            console.log({ Orders })

            $("#count").text(Orders.length)

            getDataTable();
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
        clearFields();
        $('#orderingForField').hide();
        $('#orderModal').modal('hide');
    })
}

flatpickr('#orderdate', {
    "minDate": new Date().fp_incr(0),
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



let clearFields = () => {
    $('#orderDate').val("")
    $('#name').val("")
    $('#orderMainDish').val(0)
    $('#orderSideDish').val(0)
    $('#orderCondiment').val(0)
    $('#orderFor').val(0)
    $('#orderForStaff').val(0)
}



