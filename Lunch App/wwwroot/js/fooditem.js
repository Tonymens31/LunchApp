
$(document).ready(function () {
    $('#myTable').DataTable();
    let saveOrUpdate = 0;
    let btnState = 0;
    let sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    };

    $('#foodModal').click(function () {
        btnState = 0;
        $("#saveFoodItem").html(`<i class="fa fa-save"></i> Save`)
        $('#foodItemModal').modal('show');
    })

    function loadDataTable(data) {
        $('#Foodtable').DataTable({
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
                    title: "FoodItem",
                    data: "name"
                },
                {
                    title: "Type",
                    data: "typeId"
                },
                {
                    title: "Vender",
                    data: "vendorId"
                },
                {
                    title: "Status",
                    data: "isActive",
                    render: function (data) {
                        return data === 1 ? `<button class="btn btn-success btn-sm">Active</button>` : `<button class="btn btn-sm btn-danger">Inactive</button>`;
                    }
                },
                {
                    title: "Actions", render: function () {
                        return ` <a href="#" class="text-inverse editButton" title="Edit"><i class="fas fa-edit"></i></a>
                                <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        `;
                    }
                },
            ]
        });
    }

    function loadFoodItems() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}FoodItems/GetAllFoodItem`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)                                                               
                loadDataTable(data);
                console.log(data)
                //if (data) {
                //    createFoodItemTable(data, '#foodItemTable');
                //}
            });
    };
    loadFoodItems();

   
   
    //function createFoodItemTable(data, tableId) {
    //    let tem = data.map(item => (`<tr id=${item.id} >
    //                        <td>${item.name}</td>
    //                        <td>${item.typeId}</td>
    //                        <td>${item.vendorId}</td>
    //                        <td>
    //                            <span class="badge badge-dot mr-4" style="background-color:transparent; padding: 0px;">
    //                            <i class="bg-${item.isActive == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[item.isActive].color} btn-sm" disabled>${sub[item.isActive].state}</span>
    //                        </span>
    //                       </td>
    //                       <td class="">
    //                            <a href="#" class="text-inverse editButton"  id="${item.id}"   title="Edit"><i class="fas fa-edit fa-1x"></i></a>
                              
    //                       </td>
    //                    </tr>
    //                `));

    //    $(tableId).html(tem);
    //    bindButtonsToDOM()
    //}


    makeAPIRequest(``, 'GET', '', loadForSelectBox);

    function loadForSelectBox(data) {
        data = JSON.parse(data);

        var options = '<option value="-1" disabled selected >Select Project</option>';
        data.forEach((element) => {
            options += '<option value="' + element.id + '">' + element.projectName + '</option>';
        });

        document.querySelector('#slctProject').innerHTML = options;
    }


    let foodItemsData = [
        {
            id: 1,
            foodItem: "Jollof Rice",
            type: "Side Dish",
            vendor: ["Champion Dishes", "Sweet Dishes", "Lovely Foods"],
            status: 1
        },
        {
            id: 2,
            foodItem: "Groundnut Soup with Dry Fish",
            type: "Main Dish",
            vendor: ["Tonymens International Dishes"],
            status: 1
        },
        {
            id: 3,
            foodItem: "Palava Sauce with Chicken",
            type: "Main Dish",
            vendor: ["Michael Nartey's Typical Local Chopbar"],
            status: 2
        }
    ]

    CreateFoodItemTable(foodItemsData);

    function CreateFoodItemTable(data) {
        let view = ``;

        //data = [...new Map(foodItemsData.map(item => [item.id, item])).values()];

        data.map(item => {
            let vendors = item.vendor

            view += `
                    <tr id="${item.id}">
                        <td>${item.foodItem}</td>
                        <td>${item.type}</td>
                        <td>
                            <select placeholder="Vendors" class="form-control" style="border:none; width: 70%;height: 33px;padding-bottom: 5px;padding-top: 0px !important;">
                                ${vendors.map(i => (`<option>${i}</option>`))}
                            </select>
                        </td>
                        <td>
                            <span class="badge badge-dot mr-4" style="background-color:transparent;padding: 0px;">
                                <i class="bg-${item.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[item.status].color} btn-sm" disabled>${sub[item.status].state}</span>
                            </span>
                        </td>
                         <td class="">
                            <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
                            <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
            `
        })
        $("#foodItemTable").html(view)
        bindButtonsToDOM();
    }

    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })

    function foodItemsList() {
        let formData = {
            id: uuidv4(),
            foodItem: $("#foodItem").val(),
            type: $("#foodType").val(),
            vendor: $("#vendor").val(),
            // pricing: $("#pricing").val(),
            status: parseInt($("#status").val())
        }
        foodItemsData.push(formData)
        CreateFoodItemTable(foodItemsData);
        $('#foodItemModal').modal('hide');
        clearFields()
    }

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
                btnState = 1;
                $("#saveFoodItem").html(`Update`)
                $('#foodItemModal').modal('show');
            });
        }
    }

    function getRowData(rowId) {
        let data = foodItemsData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
    }

    function populateInputFields(data) {
        let = { foodItem, type, pricing, status, vendor } = data;
        console.log(vendor)
        $('#foodItem').val(foodItem)
        $('#foodType').val(type)
        $('#status').val(status)
        $('#vendor').val(vendor)
        $('#foodItemModal').modal('show');
    };

    function clearFields() {
        $('#foodItem').val("");
        $('#foodType').val(-1);
        $('#status').val(-1);
        $('#vendor')[0].sumo.unSelectAll();
        $('#vendor')[0].sumo.reload();
        $("#saveFoodItem").prop('disabled', true)
        $("#saveFoodItem").css('cursor', 'not-allowed');
    }

    $("#saveFoodItem").click(() => {
        foodItemsList();
        clearFields();
        validation();

        iziToast.success({
            position: 'topRight',
            message: 'Food item saved successfully',
        });
    })
   

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

    $("#vendor").on('change', function () {
        validation();
    });


    $("#saveFoodItem").css('cursor', 'not-allowed');

    function validation() {
        var vendor = $("#vendor").val() ? true : false;
        if (vendor && $("#foodType").val().length > 0 &&
            $("#foodItem").val().length !== 0 && $("#status").val() > 0) {
            $("#saveFoodItem").prop('disabled', false);
            $("#saveFoodItem").css('cursor', 'pointer')
        } else {
            $("#saveFoodItem").prop('disabled', true);
            $("#saveFoodItem").css('cursor', 'not-allowed')
        }
    }

    $("#foodItemModal").on('hidden.bs.modal', function () {
        $("#vendor").val([]); 
        $("#foodItem").val("");
        $("#foodType").val("");
        $("#status").val(0);
        $("#saveFoodItem").prop('disabled', true);
        $("#saveFoodItem").css('cursor', 'not-allowed')
    })


    moneyInTxt($("#pricing").val())
    function moneyInTxt(value, standard = 'en', dec = 2) {
        nf = new Intl.NumberFormat(standard, {
            minimumFractionDigits: dec,
            maximumFractionDigits: 2
        });
        return nf.format(value);
    }

    //$('#vendor').SumoSelect({ placeholder: 'Select Vendor' });

    $('.vendor').SumoSelect();

    function createFoodItem(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
                console.log(response)
            });
    }

    function updateFoodItem(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
            });
    }
});






