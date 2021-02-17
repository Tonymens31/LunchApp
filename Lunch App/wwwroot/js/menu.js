$(document).ready(function () {
    btnState = 0;
   
    let saveOrUpdate = 0;

    let dt = new DateHandler();
    //fmtDate = (s) => {
    //    let d = new Date(Date.parse(s));
    //    return d.toUTCString().replace("GMT", "")
    //}

    fmtDate = (s) => {
        let d = new Date(Date.parse(s));
        let fmt = d.toUTCString().replace("00:00:00", "")
        return fmt.replace("GMT", "")
    }

    $('#btnAddMenu').click(function () {
        btnState = 0;
        $("#saveMenu").html(`<i class="fa fa-save"></i> Save`)
        $('#menuModal').modal('show');
    })

    function loadDataTable(data) {
        mtTab = $('#table').DataTable({
            data: data,
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
                    data: "startAt",
                    render: function (data) {
                        return getFormattedDate(data);
                    }
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
                //{
                //    title: "Pricing",
                //    data:"3"
                //},
                  {
                    title: "Order Ending",
                      data: "endAt",
                      render: function (data) {
                          return fmtDate(data);
                      }
                },
                {
                    data: "id",
                    title: "Actions", render: function () {
                        return `<button style="border:none; background:transparent" class="editButton" value=""><i class="fas fa-edit text-info"></i></button> 
                        `;
                    }
                },
            ]
        });
    }

    //"mainDishId": "8160896a-41bb-4b3b-b7cc-23b4244511fb",
    //    "sideDishId": "e76d9349-ba51-4bfe-aa32-f190c2482609",
    //        "condiDishId": "3ab53303-15f4-48ac-b75d-c244d5633be4",
    //            "mainDish": "Palmnut Soup with Goat Meat",
    //                "sideDish": "Banku",
    //                    "condiDish": "Extra Banku",
    //                        "startAt": "2021-02-16T13:58:09.313",
    //                            "endAt": "2021-02-16T13:58:09.313",

   

    function loadMenus() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}Menu/GetAllMenus`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                loadDataTable(data)
                //console.log(data);
                //if (data) {
                //    createMenuTable(data, '#vendorTable');
                //}
            });
    }
    loadMenus();

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
    

    //function loadMenus() {
    //    let view = ``;
    //    menuData = [...new Map(menuData.map(item => [item.id, item])).values()];
    //    menuData.map(item => {
    //        view += `
    //        <tr id=${item.id}>
    //            <td>${item.date}</td>
    //            <td>${item.maindish}</td>
    //            <td>${item.sidedish}</td>
    //            <td>${item.condiment}</td> 
    //            <td>${item.price}</td>
    //            <td class="">
    //                 ${item.expiryDate}
    //            </td>
    //            <td class="">
    //                <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
    //            </td>
    //        </tr>
    //    `
    //    })
    //    $('#menuTable').html(view);
    //    bindButtonsToDOM()
    //}

   
    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })

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
            $("#menuMainDish").val().length !== '' ?
           // $("#price").val().length > 0 ?
            ($("#saveMenu").prop('disabled', false), $("#saveMenu").css('cursor', 'pointer')) :
            ($("#saveMenu").prop('disabled', true), $("#saveMenu").css('cursor', 'not-allowed'))
    }



    $("#saveMenu").click(() => {
        let postDatasArr = [];
        let formdata = {
            "startAt": $("#menuDate").val(),
            "mainDishId": $("#menuMainDish").val(),
            "sideDishId": $("#menuSideDish").val(),
            "condiDishId": $("#menuCondiment").val(),
            "endAt": $("#expiryDate").val(),
            "companyId": '00000000-0000-0000-0000-000000000000'
        }


       // console.log(formdata)
        if (saveOrUpdate == 1) {
            updateMenu(`${_path_url}Menu/PutMenu`, formdata)
        } else {
            postDatasArr.push(formdata);
            createMenu(`${_path_url}Menu/PostMenu`, postDatasArr)
            
        }
        $('#menuModal').modal('hide');
        //clearFields()
        console.log(postDatasArr)
    })

    


    function createMenu(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
                console.log({response})
            });
    }

    function updateMenu(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
            });
    }
});           