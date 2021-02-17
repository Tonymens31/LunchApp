
$(document).ready(function () {
    $('#myTable').DataTable();
    let saveOrUpdate = 0;
    let btnState = 0;
    let sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    };
    let mtTab;

    //var table = $('#table').DataTable();

    $('#foodModal').click(function () {
        btnState = 0;
        $("#saveFoodItem").html(`<i class="fa fa-save"></i> Save`)
        $('#foodItemModal').modal('show');
    })

    function loadDataTable(data) {
        console.log({ data})
       mtTab =   $('#table').DataTable({
           data: data,
           pageLength: 10,
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
                    data: "type"
                },
                {
                    title: "Vendor",
                    data: "vendor"
                },
                {
                    title: "Status",
                    data: "isActive",
                    render: function (data) {
                        return data === 1 ? `<button class="btn btn-success btn-sm">Active</button>` : `<button class="btn btn-sm btn-danger">Inactive</button>`;
                    }
                },
                {
                    data: "id",
                    title: "Actions", render: function (data) {
                        return `<button style="border:none; background:transparent" class="editButton" value="${data}"><i class="fas fa-edit text-info"></i></button> 
                                <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        `;
                    }
                },
            ]
        });
    }

    //$(".editButton").click(() => {
    //    alert("ok")
    //})
    $(document).on("click", ".editButton", function () {
       console.log($(this).val())
    })
    //$(".editButton").on('click', 'tr', function() {
    //    console.log(mtTab.row(this).data());
    //});

    function loadFoodItems() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}FoodItems/GetAllFoodItems`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                loadDataTable(data);

            });
    };
    loadFoodItems();


    function loadDataTypes() {
        let data = { type: "ftyp" };
        makeAPIRequest(`${_path_url}FoodItems/GetAllCode`, data)
            .done(function (data) {
               
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                setGeneric(data, "Select Food Type","#foodType")
            });
    }
    loadDataTypes(); 

    function setGeneric(data, title, elementID) {
        let template = `<option value = "">${title}</option>`
        template += data.map(type => (
            `<option value = "${type.id}">${type.name}</option>`
        ))
        $(elementID).html(template);
    }

    function loadVendors() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}APICalls/GetAllVendors`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                setGeneric(data, "Select Vendor(s)", "#vendor");
            });
    };
    loadVendors();

    function setGeneric(data, title, elementID) {
        let template = `<option value = "">${title}</option>`
        template += data.map(type => (
            `<option value = "${type.id}">${type.name}</option>`
        ))
        $(elementID).html(template);
    }

    //makeAPIRequest(`GetAllCodes`, 'GET', '', loadForSelectBox);

    //function loadForSelectBox(data) {
    //    data = JSON.parse(data);

    //    var options = '<option value="-1" disabled selected >Select Food Types</option>';
    //    data.forEach((element) => {
    //        options += '<option value="' + element.id + '">' + element.type + '</option>';
    //    });

    //    document.querySelector('#foodType').innerHTML = options;
    //}




    //CreateFoodItemTable(foodItemsData);

    //function CreateFoodItemTable(data) {
    //    let view = ``;

    //    //data = [...new Map(foodItemsData.map(item => [item.id, item])).values()];

    //    data.map(item => {
    //        let vendors = item.vendor

    //        view += `
    //                <tr id="${item.id}">
    //                    <td>${item.foodItem}</td>
    //                    <td>${item.type}</td>
    //                    <td>
    //                        <select placeholder="Vendors" class="form-control" style="border:none; width: 70%;height: 33px;padding-bottom: 5px;padding-top: 0px !important;">
    //                            ${vendors.map(i => (`<option>${i}</option>`))}
    //                        </select>
    //                    </td>
    //                    <td>
    //                        <span class="badge badge-dot mr-4" style="background-color:transparent;padding: 0px;">
    //                            <i class="bg-${item.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[item.status].color} btn-sm" disabled>${sub[item.status].state}</span>
    //                        </span>
    //                    </td>
    //                     <td class="">
    //                        <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
    //                        <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
    //                    </td>
    //                </tr>
    //        `
    //    })
    //    $("#foodItemTable").html(view)
    //    bindButtonsToDOM();
    //}

    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })


  

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


    $("#saveFoodItem").click(() => {
        let postDatasArr = [];
        let formdata = {
            "name": $("#vendorName").val(),
            "typeId": $("#vendorEmail").val(),
            "vendorId": $("#phone1").val(),
            "isActive": parseInt($("#status").val()),
            "companyId": '00000000-0000-0000-0000-000000000000'
        }


        if (saveOrUpdate == 1) {
            updateFoodItem(`${_path_url}FoodItems/UpdateFoodItems`, formdata)
        } else {
            postDatasArr.push(formdata);
            createFoodItem(`${_path_url}FoodItems/PostFoodItems`, postDatasArr)
        }

        foodItemsList();
        clearFields();
        $('#foodItemModal').modal('hide');

        iziToast.success({
            position: 'topRight',
            message: 'Food item saved successfully',
        });
    })

   
    //$('#vendor').SumoSelect({ placeholder: 'Select Vendor' });

    //$('.vendor').SumoSelect();

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






