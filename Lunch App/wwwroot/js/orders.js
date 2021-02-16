$(document).ready(function () {
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
        $('#orderModal').modal('show');

    })



    let orderData = [
        {
            id: 1,
            date: "23-03-2021",
            name: "Kweku Kyei-Baffour",
            maindish: "Palmnut Soup with Goat Meat",
            sidedish: "	Fufu",
            condiment: "More Pepper",
        },
        {
            id: 2,
            date: "23-03-2021",
            name: "Kwabena Asante",
            maindish: "Palmnut Soup with Fish",
            sidedish: "Banku",
            condiment: "Extra Meat"
        },
        {
            id: 3,
            date: "23-03-2021",
            name: "Yaw Nkansah",
            maindish: "Vegetable Stew with Chicken ",
            sidedish: "Plain Rice",
            condiment: "Extra Chicken"
        },
        // {
        //    id: 1,
        //    date: "23-03-2021",
        //    name: "Kweku Kyei-Baffour",
        //    maindish: "Palmnut Soup with Goat Meat",
        //    sidedish: "Fufu",
        //    condiment: "More Pepper",
        //},
        //{
        //    id: 2,
        //    date: "23-03-2021",
        //    name: "Kwabena Asante",
        //    maindish: "Palmnut Soup with Fish",
        //    sidedish: "Banku",
        //    condiment: "Extra Meat"
        //},
        //{
        //    id: 3,
        //    date: "23-03-2021",
        //    name: "Yaw Nkansah",
        //    maindish: "Vegetable Stew with Chicken ",
        //    sidedish: "Plain Rice",
        //    condiment: "Extra Chicken"
        //},

    ];

    loadOrderData(orderData)

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

    flatpickr('#orderDate', {
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

    function loadOrderData() {
        let view = ``;


        orderData = [...new Map(orderData.map(item => [item.id, item])).values()];

        orderData.map(item => {
            view += `
                <tr id=${item.id}>
                    <td>
                        ${(item.date)}
                    </td>
                    
                    <td>${item.name}</td>
                    <td>${item.maindish}</td>
                    <td>${item.sidedish}</td>
                    <td>${item.condiment}</td>
                    <td class="">
                        <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
                        <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                     </td>
                </tr>
            `
        })
        $('#orderTable').html(view);
        bindButtonsToDOM()
        $('#count').text(orderData.length);
    }

    $("#saveOrder").click(() => {
        orderFood();
        validation();
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

    $('#closeBtn').click(function () {
        clearFields();
        validation();
        $('#orderingForField').hide();
    })



    //function addToTable(data) {
    //    let { date, name, maindish, sidedish, condiment, orderFor } = data;
    //    let tem = `<tr id=""> 
    //                <td>${date}</td>
    //                <td>${name}</td>
    //                <td>${maindish}</td> 
    //                <td>${orderFor}</td>
    //                <td>${sidedish}</td>
    //                <td>${condiment}</td>
    //            </tr>`;

    //    $('#orderTable').prepend(tem);
    //    $('#orderModal').modal('hide');
    //    clearFields();
    //}

    var userSelection = document.getElementsByClassName('required');

    for (var i = 0; i < userSelection.length; i++) {
        (function (index) {
            userSelection[index].addEventListener("input", function () {
                let el = userSelection[index].id;

                let inputel = document.getElementById(el);
                inputel.value ? (inputel.style.border = "1px solid #ced4da", validation()) : (inputel.style.border = "1px solid red", validation(), inputel.focus())
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

    function clearFields() {
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




    //function validateSubmitFields() {
    //    $('#orderSideDish').val() != '' &&
    //        $('#EmergencyContactAddress').val() != '' &&
    //        $('#EmergencyContactNumber').val() != '' &&
    //        validatePhone($('#EmergencyContactNumber').val()) &&
    //        $('#EmergencyContactNumber').val().length >= 10 &&
    //        $('#EmergencyContactNumber').val().length < 15
    //        ?
    //        $('#btnSave').prop('disabled', false)
    //        :
    //        $('#btnSave').prop('disabled', true);
    //}



    //$('.transfer-input-check').on('keyup change', function () {
    //    validateSubmitFields();
    //});

    $("#saveOrder").css('cursor', 'not-allowed');
    function validation() {
        if (orderForState === 1) {
            $("#orderDate").val().length > 0 &&
                $("#name").val().length !== '' &&
                $("#orderMainDish").val().length !== '' &&
                $("#orderFor").val().length !== '' &&
                $("#orderSideDish").val().length !== '' ?
                ($("#saveOrder").prop('disabled', false), $("#saveOrder").css('cursor', 'pointer')) :
                ($("#saveOrder").prop('disabled', true), $("#saveOrder").css('cursor', 'not-allowed'))
        }
        else if (orderForState === 0) {
            $("#orderDate").val().length > 0 &&
                $("#orderForStaff").val() > 0 &&
                $("#orderMainDish").val().length !== '' &&
                $("#orderFor").val().length !== '' &&
                $("#orderSideDish").val().length !== '' ?
                ($("#saveOrder").prop('disabled', false), $("#saveOrder").css('cursor', 'pointer')) :
                ($("#saveOrder").prop('disabled', true), $("#saveOrder").css('cursor', 'not-allowed'))
        } else {
            $("#orderDate").val().length > 0 &&
                $("#name").val().length !== 0 &&
                $("#orderForStaff").val() > 0 &&
                $("#orderMainDish").val().length !== '' &&
                $("#orderFor").val().length !== '' &&
                $("#orderSideDish").val().length !== '' ?
                ($("#saveOrder").prop('disabled', false), $("#saveOrder").css('cursor', 'pointer')) :
                ($("#saveOrder").prop('disabled', true), $("#saveOrder").css('cursor', 'not-allowed'))
        }
    }

    //let findOrder = (id) => {
    //    let getOrder = $.grep(orderData, (order) => {
    //        return order.id == id;
    //    });
    //    console.log(getOrder)
    //    return getOrder[0] ? getOrder[0] : null;
    //}

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    $("searchIcon").click(function () {
        myFunction();
        console.log(input)
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

    //function printDiv() {
    //    var divContents = document.getElementById("orderTable").innerHTML;
    //    var a = window.open('', '', 'height=500, width=500');
    //    a.document.write('<html>');
    //    a.document.write('<body > <h1>Div contents are <br>');
    //    a.document.write(divContents);
    //    a.document.write('</body></html>');
    //    a.document.close();
    //    a.print();
    //} 


    $('#btnPrintOrders').click(function () {
        //printDiv();
    })

    //var id = 0;
    //$(".searchIcon").click(function (e) {

    //    var id = e.target.id;
    //    var order = findOrder(id);
    //   //$('#orderDate').text(order.date)
    //    $('#name').text(order.name)
    //    $('#orderMainDish').text(order.maindish)
    //    $('#orderSideDish').text(order.sidedish)
    //    $('#orderCondiment').text(order.condiment)
    //    $("#orderModal").modal("show");
    //})

    //$("#searchIcon").click(function () {

    //    let searchItem = $("#searchField").val();
    //    let searchOrder = orderData.filter(i => i.name.toLowerCase().includes(searchItem));

    //    console.log(searchOrder)
    //    if (searchOrder.length === 0) {
    //        message('error', 'Order not found')
    //    }
    //    console.log(searchOrder)

    //    if (searchOrder) {
    //        $("#orderTable").html("");
    //        let searchFromOrderList = searchOrder.map(item => {

    //            return ` 
    //                <tr id=${item.id}>
    //                <td>
    //                    ${fmtDate(item.date)}
    //                </td>
    //                <td>${item.name}</td>
    //                <td>${item.maindish}</td>
    //                <td>${item.sidedish}</td>
    //                <td>${item.condiment}</td>
    //            </tr>
    //        `
    //        });
    //        //console.log(searchFromMovieList)

    //        $("#orderTable").html(searchFromOrderList);
    //    } else {
    //        message('error', 'M not found')
    //    }
    //})
});

