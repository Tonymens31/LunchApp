
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

//let createOrder = () => {
//    Order = {};

//    $('#orderModal').modal('show');
//    $("#saveOrder").css('cursor', 'not-allowed');
//    $("#saveOrder").html(`<i class="fa fa-save"></i> Save`);

//    $('#closeBtn').click(() => {
//        clearFields();
//        $('#orderModal').modal('hide');
//    })

//    $("#orderDate, #orderMainDish, #orderSideDish, #orderCondiment' #orderFor, #name",).bind('change', () => {
//        validateFoodItem();
//    });

//}

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
               // data: "mainDish"
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
            //},

            //{
            //    data: "id",
            //    title: "Actions", render: function (data) {
            //        return `
            //            <button style="border:none; background:transparent" class="editButton" data-id="${data}">
            //                <i class="fas fa-edit text-info" data-id=${data}></i>
            //            </button> 
            //            <button style="border:none; background:transparent" class="deleteButton" data-id=${data}>
            //                <i class="fas fa-trash text-danger" data-id=${data}></i>
            //            </a>
            //            `;
            //    }
            },
        ]
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

function orderFood() {

    let formdata = {
        id: uuidv4(),
        date: $("#orderDate").val(),
        maindish: $("#orderMainDish").val(),
        orderFor: $('#orderFor').val(),
        sidedish: $("#orderSideDish").val(),
        condiment: $("#orderCondiment").val(),
    }
    orderForState === 0 ? formdata.name = $('#orderForStaff').val() : formdata.name = $("#name").val()


    console.log(formdata)

    orderData.push(formdata)
    loadOrderData()
    $('#orderModal').modal('hide');
    clearFields();
}

var userSelection = document.getElementsByClassName('required');

for (var i = 0; i < userSelection.length; i++) {
    (function (index) {
        userSelection[index].addEventListener("input", function () {
            let el = userSelection[index].id;

            let inputel = document.getElementById(el);
            inputel.value ? (inputel.style.border = "1px solid #ced4da", ValidateOrder()) : (inputel.style.border = "1px solid red", ValidateOrder(), inputel.focus())
        })
    })(i);
}

function bindButtonsToDOM() {
    let elements = document.getElementsByClassName('editButton');

    for (let x = 0; x < elements.length; x++) {
        elements[x].addEventListener('click', function (e) {
            getRowData(this.id)
            btnState = 1
            $("#saveOrder").html(`Update`)
            $('#orderModal').modal('show');

        });
    }
}


function getRowData(rowId) {
    let data = orderData.filter(ele => ele.id.toString() === rowId)[0];
    populateInputFields(data);
    // saveOrUpdate = 1;
}

function populateInputFields(data) {
    let { name, date, maindish, sidedish, condiment, orderFor, orderForStaff } = data;

    $('#orderDate').val(date)
    $('#name').val(name)
    $('#orderMainDish').val(maindish)
    $('#orderSideDish').val(sidedish)
    $('#orderCondiment').val(condiment)
    $('#orderFor').val(orderFor)
    $('#orderForStaff').val(orderForStaff)


    $('#orderingForField').show()
    $('#name').prop('disabled', false)
    $('#orderModal').modal('show');
};

let clearFields = () => {
    $('#orderDate').val("")
    $('#name').val("")
    $('#orderMainDish').val(0)
    $('#orderSideDish').val(0)
    $('#orderCondiment').val(0)
    $('#orderFor').val(0)
    $('#orderForStaff').val(0)
}

let orderForState = 0;

$("#orderFor").change(function () {

    //$("#name").prop('hidden', false)


    if ($(this).val() == "staff") {
        orderForState = 0;
        $('#orderingForField').show()
        $("#name").show();
        $("#orderForStaff").prop('hidden', false)
        $("#name").prop('disabled', false)
        //console.log('name')
    }
    else if
        ($(this).val() == "quest") {
        orderForState = 1;
        $('#orderingForField').show()
        $("#orderForStaff").prop('hidden', true)
        $("#name").prop('hidden', false)
        $("#name").prop('disabled', false)

    }
})

$('#orderingForField').hide()


//$("#saveOrder").css('cursor', 'not-allowed');
//let ValidateOrder = () => {
//    let _order = {
//        orderDate: $("#orderDate").val(),
//        mainDishId$: $("#orderMainDish").val(),
//        sideDishId: $("#orderSideDish").val(),
//        condiDishId: $("#orderFor").val(),
//        price: $("#price").val(),
//    }

//}

//($("#saveOrder").prop('disabled', false), $("#saveOrder").css('cursor', 'pointer')) :
//($("#saveOrder").prop('disabled', true), $("#saveOrder").css('cursor', 'not-allowed'))


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

$("searchIcon").click(function () {
    myFunction();

})

function myFunction() {
    var td, i, txtValue;
    let input = document.getElementById("myInput");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("myTable");
    let tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


$('#btnPrintOrders').click(function () {
    //printDiv();
})


