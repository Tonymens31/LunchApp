$(document).ready(function () {
    btnState = 0;
    let dt = new DateHandler();
    //fmtDate = (s) => {
    //    let d = new Date(Date.parse(s));
    //    return d.toUTCString().replace("GMT", "")
    //}


    $('#btnAddMenu').click(function () {
        btnState = 0;
        $("#saveMenu").html(`<i class="fa fa-save"></i> Save`)
        $('#menuModal').modal('show');
    })

    let menuData = [
        {
            id: 1,
            date: "19-01-2021",
            maindish: "Palmnut Soup with Goat Meat",
            sidedish: "Fufu",
            condiment: "More Pepper",
            expiryDate: "20-01-2021 11:00",
            price: moneyInTxt("4", "en", 2)

        },
        {
            id: 2,
            date: "20-01-2021",
            maindish: "Palmnut Soup with Fish",
            sidedish: "Konkonte",
            condiment: "Extra Meat",
            expiryDate: "21-01-2021 10:00",
            price: moneyInTxt("4", "en", 2)
        },
        {
            id: 3,
            date: "21-01-2021",
            maindish: "Palava Sauce with Tuna and Egg",
            sidedish: "Apem",
            condiment: "Extra Meat",
            expiryDate: "22-01-2021 10:00",
            price: moneyInTxt("3", "en", 2)
        },
        {
            id: 1,
            date: "19-01-2021",
            maindish: "Palmnut Soup with Goat Meat",
            sidedish: "Fufu",
            condiment: "More Pepper",
            expiryDate: "20-01-2021 11:00",
            price: moneyInTxt("4", "en", 2)

        },
        {
            id: 2,
            date: "20-01-2021",
            maindish: "Palmnut Soup with Fish",
            sidedish: "Konkonte",
            condiment: "Extra Meat",
            expiryDate: "21-01-2021 10:00",
            price: moneyInTxt("4", "en", 2)
        },
        {
            id: 3,
            date: "21-01-2021",
            maindish: "Palava Sauce with Tuna and Egg",
            sidedish: "Apem",
            condiment: "Extra Meat",
            expiryDate: "22-01-2021 10:00",
            price: moneyInTxt("3","en",2)
        },
    ];




    flatpickr('#menuDate', {
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

    flatpickr('#expiryDate', {
        "minDate": new Date().fp_incr(1),
        "enableTime": true,
        "dateFormat": "d-m-Y H:i",
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
    loadMenuData()

    function loadMenuData() {
        let view = ``;




        menuData = [...new Map(menuData.map(item => [item.id, item])).values()];
        menuData.map(item => {
            view += `
            <tr id=${item.id}>
                <td>${item.date}</td>
                <td>${item.maindish}</td>
                <td>${item.sidedish}</td>
                <td>${item.condiment}</td> 
                <td>${item.price}</td>
                <td class="">
                     ${item.expiryDate}
                </td>
                <td class="">
                    <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
                </td>
            </tr>
        `
        })
        $('#menuTable').html(view);
        bindButtonsToDOM()
    }
    $("#saveMenu").click(() => {
        MenuFood();
        validation();

        iziToast.success({
            position: 'topRight',
            message: 'Menu saved successfully',
        });

    })

    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })

    //$( "#myselect option:selected" ).text();
    function MenuFood() {
        let formData = {
            id: uuidv4(),
            date: $("#menuDate").val(),
            maindish: $("#menuMainDish").val(),
            sidedish: $("#menuSideDish").val(),
            condiment: $("#menuCondiment").val(),
            expiryDate: $("#expiryDate").val(), 
            price:moneyInTxt($("#price").val(),"en",2)
        }
        console.log(formData)

        menuData.push(formData)
        loadMenuData()
        $('#menuModal').modal('hide');
        clearFields()
    }

    //$("#expiryDate").change(function () {})

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
                btnState = 1
                $("#saveMenu").html(`Update`)
                $('#menuModal').modal('show');
            });
        }
    }

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

    function getRowData(rowId) {
        let data = menuData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
        // saveOrUpdate = 1;
    }

    function populateInputFields(data) {
        let { date, maindish, sidedish, condiment, price, expiryDate } = data;
        $('#menuDate').val(date)
        $('#menuMainDish').val(maindish)
        $('#menuSideDish').val(sidedish)
        $('#menuCondiment').val(condiment)
        $('#expiryDate').val(expiryDate)
        $('#price').val(price)
        $('#menuModal').modal('show');
    };


    function clearFields() {
        $('#menuDate').val("")
        $('#menuMainDish').val(-1)
        $('#menuCondiment').val(-1)
        $('#expiryDate').val("")
        $('#price').val("")
    }


    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //function addToTable(data) {
    //    let { date, maindish, sidedish, condiment, beverage, expiryDate } = data;
    //    let tem = `<tr id="">
    //                <td>${date}</td>
    //                <td>${maindish}</td>
    //                <td>${sidedish}</td>
    //                <td>${condiment}</td>
    //                <td>${beverage}</td
    //                <td>${expiryDate}</td>
    //            </tr>`;

    //    $('#menuTable').prepend(tem);
    //    $('#menuModal').modal('hide');
    //}


    $("#saveMenu").css('cursor', 'not-allowed');
    function validation() {
        $("#menuDate").val().length > 0 &&
            $("#expiryDate").val().length !== 0 &&
            $("#menuSideDish").val().length !== '' &&
            $("#menuMainDish").val().length !== '' &&
            $("#price").val().length > 0 ?
            ($("#saveMenu").prop('disabled', false), $("#saveMenu").css('cursor', 'pointer')) :
            ($("#saveMenu").prop('disabled', true), $("#saveMenu").css('cursor', 'not-allowed'))
    }
});           