let saveOrUpdate = 0;
let selectedRow = "";
let btnState = 0;
let FoodItems = [];
let sub = {
    1: { color: 'success', state: 'Active' },
    0: { color: 'danger', state: 'Inactive' }
};
let mtTab;

let ShowFoodModal = () => {

}

$(document).ready(function () {
    $('#myTable').DataTable();


    //var table = $('#table').DataTable();

    $('#foodModal').click(function () {
        btnState = 0;
        $("#saveFoodItem").html(`<i class="fa fa-save"></i> Save`)
        $('#foodItemModal').modal('show');
    })

    loadFoodItems();
    function loadFoodItems() {
        let data = { companyId: companyId };
        makeAPIRequest(`${_path_url}FoodItems/GetAllFoodItems`, data)
            .done(function (data) {
                data = JSON.parse(data)
                data = JSON.parse(data.Body)
                FoodItems = data;
                loadDataTable(data);
            });
    };


    function loadDataTable(data) {
        console.log({ data })
        mtTab = $('#table').DataTable({
            data: data,
            pageLength: 10,
            destroy: true,
            searching: true,
           
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
                    data: "name",
                    width: "28%"
                },
                {
                    title: "Type",
                    data: "type",
                    width: "21%"
                },
                {
                    title: "Vendor",
                    data: "vendor",
                    width: "30%"
                },
                {
                    title: "Status",
                    data: "isActive",
                    render: function (data) {
                        return data === 1 ? `<button class="btn btn-success btn-sm">Active</button>` : `<button class="btn btn-sm btn-danger">Inactive</button>`;
                    },
                    width: "16%"
                },
                {
                    data: "id",
                    title: "Actions", render: function (data) {
                        return `<button style="border:none; background:transparent" class="editButton" value="${data}"><i class="fas fa-edit text-info"></i></button> 
                                <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                        `;
                    },
                    width: "5%"
                },
            ]
        });
    }


    $(document).on("click", ".editButton", function () {

        saveOrUpdate = 1;
        let rowid = $(this).val();
        let rowData = FoodItems.filter(x => x.id === rowid)[0]
        selectedRow = rowData.id;
        populateInputFields(rowData);

        $("#saveFoodItem").html(`Update`)

    })

    $("#table").on('click', '.deleteButton', '.transfer-input-check', function (event) {
        $(this).parents('tr').detach();
    });


    function loadDataTypes() {
        let data = { type: "ftyp" };
        makeAPIRequest(`${_path_url}FoodItems/GetAllCode`, data)
            .done(function (data) {

                data = JSON.parse(data)
                data = JSON.parse(data.Body)

                setGeneric(data, "Select Food Type", "#foodType")
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
                setGeneric(data, "", "#vendor");
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


    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })


    //function bindButtonsToDOM() {
    //    let elements = document.getElementsByClassName('editButton');

    //    for (let x = 0; x < elements.length; x++) {
    //        elements[x].addEventListener('click', function (e) {
    //            getRowData(this.id)
    //            btnState = 1;
    //            $("#saveFoodItem").html(`Update`)
    //            $('#foodItemModal').modal('show');
    //        });
    //    }
    //}

    function getRowData(rowId) {
        let data = foodItemsData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
    }

    function populateInputFields(data) {
        let { name, typeId, vendorId, isActive } = data;
        $('#foodItem').val(name);
        $('#foodType').val(typeId);
        $('#status').val(isActive);
        $('#vendor').val(vendorId);
        $('#foodItemModal').modal('show');
        $("#saveFoodItem").html(`Update`);
    };


    function clearFields() {
        $('#foodItem').val("");
        $('#foodType').val(-1);
        $('#status').val(-1);
        $('#vendor').val(-1);
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
        if (vendor && $("#foodType").val().length !== "" &&
            $("#foodItem").val().length !== 0 && $("#status").val() > -1) {
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
            "pkId": selectedRow,
            "name": $("#foodItem").val(),
            "typeId": $("#foodType").val(),
            "vendorId": $("#vendor").val(),
            "isActive": parseInt($("#status").val()),
            "companyId": '00000000-0000-0000-0000-000000000000'
        }

        if (saveOrUpdate === 0) {
            postDatasArr.push(formdata);
            createFoodItem(`${_path_url}FoodItems/PostFoodItems`, postDatasArr)
        } else {
            updateFoodItem(`${_path_url}FoodItems/PutFoodItems`, formdata)
        }

        iziToast.success({
            position: 'topRight',
            message: 'Saved successfully',
        });

        $('#foodItemModal').modal('hide');

        clearFields();
        loadFoodItems();
    })


    //$('#vendor').SumoSelect({ placeholder: 'Select Vendor' });

    //$('.vendor').SumoSelect();

    function createFoodItem(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
               // console.log(response)
            });
    }

    function updateFoodItem(url, data) {
        makeAPIRequest(url, data)
            .done(function (response) {
            });
    }
});






