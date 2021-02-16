$(document).ready(function () {
    let btnState = 0;
    let dt = new DateHandler();

    $('#tableId').DataTable();

    $('#holidayBtn').click(function () {
        btnState = 0
        $("#saveHoliday").html(`<i class="fa fa-save"></i> Save`)

        $('#holidayModal').modal('show');
    })


    fmtDate = (s) => {
        let d = new Date(Date.parse(s));
         let fmt = d.toUTCString().replace("00:00:00", "")
        return fmt.replace("GMT", "")
    }

    flatpickr('#date', {
        "dateFormat": "d-m-Y"
    });

    let holidayData = [
        {
            id: 1,
            date:"01-01-2021",
            name: "New Year Day"
        },
        {
            id: 2,
             date:"08-03-2021",
            name: "Independence Day"
        },
        {
            id: 3,
            date:"02-04-2021",
            name: "Good Friday"
        }, {
            id: 1,
            date:"01-01-2021",
            name: "New Year Day"
        },
         {
            id: 2,
             date:"08-03-2021",
            name: "Independence Day"
        },
        {
            id: 3,
            date:"02-04-2021",
            name: "Good Friday"
        },
        {
            id: 1,
            date:"01-01-2021",
            name: "New Year Day"
        },
         {
            id: 2,
             date:"08-03-2021",
            name: "Independence Day"
        },
        {
            id: 3,
            date:"02-04-2021",
            name: "Good Friday"
        },
        
    ]
    loadHolidayData();

    $("#saveHoliday").click(() => {
        holidayList();
        validation();
        iziToast.success({
            position: 'topRight',
            message: 'Holiday added successfully',
        });
        //message('success', 'Holiday added sucessfully');
    })

    function loadHolidayData() {

        let view = ``;
        holidayData = [...new Map(holidayData.map(item => [item.id, item])).values()];

        holidayData.map(item => {
          view +=  `
            <tr id="${item.id}">
               <td class="">
                     ${(item.date)}
                </td>
                <td>${item.name}</td>
                <td class="">
                    <a href="#" class="text-inverse editButton" id="${item.id}"  title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                </td>
            </tr>
            `
        })
        $("#holidayTable").html(view)
        bindButtonsToDOM();
    }

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
                btnState = 1
                $("#saveHoliday").html(`Update`);
                $('#holidayModal').modal('show');
            });
        }
    }

    function getRowData(rowId) {
        let data = holidayData.filter(ele => ele.id.toString() === rowId)[0];
        populateInputFields(data);
        // saveOrUpdate = 1;
    }

    function populateInputFields(data) {
        let = { date, name } = data;
        //console.log(date)
        //console.log(date)

        $('#date').val(date)
        $('#name').val(name)
        $('#holidayModal').modal('show');
    };
      
    $('#closeBtn').click(function () {
        clearFields();
        validation();
    })


    function holidayList() {
        let formData = {
            id: uuidv4(),
            date: $("#date").val(),
            name: $("#name").val(),
        }

        holidayData.push(formData)

        loadHolidayData();
        $('#holidayModal').modal('hide');
        clearFields()
    }


    function clearFields() {
        $('#date').val("")
        $('#name').val("")
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

    $("#saveHoliday").css('cursor', 'not-allowed');
    function validation() {
        $("#name").val().length > 0 &&
            $("#date").val() !== ""  ?
            ($("#saveHoliday").prop('disabled', false), $("#saveHoliday").css('cursor', 'pointer')) :
            ($("#saveHoliday").prop('disabled', true), $("#saveHoliday").css('cursor', 'not-allowed'))
    }

});
