$(document).ready(function () {
    let AllProducts = '';
    let getAllProducts = () => {
        mthdPutOrPost(`${_path_url}Applications/LoadApplications`)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);

                if (Number(doneData.Status) === 200 || Number(doneData.Status) === 201) {
                    localStorage.setItem("products", doneData.Body);
                    prices = JSON.parse(doneData.Body);
                }
            });
    }; 
    var licenses = {
        lite: {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            price: 10.00,
            apps: [
                { id: "6029e75f-bf63-438c-b6e5-b67d89cff5b6", name: "HR" },
                { id: "d21c52b8-491c-42b6-8b86-5f26b5b4e334", name: "Payroll" }
            ]
        },
        standard: {
            id: "d105483f-d7c1-4a59-917a-69b6081f954d",
            price: 20.00,
            apps: [
                { id: "6029e75f-bf63-438c-b6e5-b67d89cff5b6", name: "HR" },
                { id: "d21c52b8-491c-42b6-8b86-5f26b5b4e334", name: "Payroll" },
                { id: "4d08da71-c51b-4fda-bd54-68ca7a7a8dd7", name: "Time Tracker" }
            ]
        },
        enterprise: {
            id: "f0efe16c-d96d-485f-956b-cd3c8eaaef85",
            price: 50.00,
            apps: [
                { id: "6029e75f-bf63-438c-b6e5-b67d89cff5b6", name: "HR" },
                { id: "d21c52b8-491c-42b6-8b86-5f26b5b4e334", name: "Payroll" },
                { id: "4d08da71-c51b-4fda-bd54-68ca7a7a8dd7", name: "Time Tracker" },
                { id: "5c73b7f2-2450-421c-8235-4ded6b88ca08", name: "ESS" }
            ]
        }
    };

    $("#phone1").focusout(function () {
        var pull = $("#phone1").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim();
        //console.log(pull);
    });

    //function getTotalAmountToPay() {
    //    let supportAmt = Number($("#support").find(':selected').data('price')) || 0,//add
    //        minContractAmt = Number($("#minContract").find(':selected').data('price')) || 0,//add
    //        periodicAmt = Number($("#periodic").find(':selected').data('price')) || 0,//add
    //        empAmt = Number($("#noOfEmployees").find(':selected').data('price')) || 0,//add
    //        usersAmt = Number($("#noOfUsers").find(':selected').data('price')) || 0,
    //        LicenseAmt = Number($("#cmbLicense").find(':selected').data('price')) || 0,
    //        priceToPay = 0;

    //    priceToPay = supportAmt + minContractAmt + periodicAmt + empAmt + usersAmt + LicenseAmt;
    //    //console.log({ priceToPay }, { supportAmt }, { minContractAmt }, { periodicAmt }, { empAmt }, { usersAmt });
    //    priceToPay = priceToPay < 1 ? 0 : priceToPay;

    //    return parseFloat(priceToPay).toFixed(2) || 0.00;
    //}

    $("#support,#minContract,#periodic,#noOfEmployees,#noOfUsers,#cmbLicense").change(function () {
        let thisId = this.id
        if (thisId === 'cmbLicense') {
            let selectedCmbLicense = $('#cmbLicense').val(),
                appsInLicense = "";

            if (selectedCmbLicense) {
                appsInLicense = licenses[`${selectedCmbLicense}`]["apps"];
            }

            localStorage.setItem("selectedLicense", selectedCmbLicense);
            $("#rowApps").html("");
            $(appsInLicense).each(function (k, val) {
                $("#rowApps").append(`<li>
                                        <input type="checkbox" id="chk${val.name}" value="${val.id}" class="appsIds"><label for="chk${val.name}">
                                            ${val.name}
                                        </label>
                                    </li>`);
            });
        }
         
    }).change();


    $('#myCartModal').on('shown.bs.modal', function () {
        dataOnModal();
    });

    $('#QuoteModal').on('shown.bs.modal', function () {
        let selectedCmbLicense = $('#QcmbLicense').val(),
            appsInLicense = "";

        if (selectedCmbLicense) {
            appsInLicense = licenses[`${selectedCmbLicense}`]["apps"];
        }

        localStorage.setItem("selectedLicense", selectedCmbLicense);
        $("#QrowApps").html("");
        $(appsInLicense).each(function (k, val) {
            $("#QrowApps").append(`<li>
                                    <input type="checkbox" id="chk${val.name}" value="${val.id}" class="appsIds"><label for="chk${val.name}">
                                        ${val.name}
                                    </label>
                                </li>`);
        });
    });


    $('#createAccount').click(function () {
        $('#registerModal').modal('show');
    });
});

document.addEventListener("DOMContentLoaded", (event) => {
    let MenusList = document.querySelectorAll('.menus li a');
    try {
        let createAccountNavBtn = document.querySelector('#createAccount');
    } catch (e) {
        console.log({ e });
    }


    MenusList.forEach(menu => {
        if (menu.innerHTML === '@Title') {
            console.log(menu.innerHTML, '@Title')
            menu.classList.add("active");
        }
    });

    $('#btnCompare').click(function () {
        $('#compareModal').modal('show');
    });


    $('#btnPay').click(function () {
        $('#cartModal').modal('hide');
        $('#welcomeModal').modal('show');
    }); 

    // Get the modal
    let promptModal = document.getElementById("prompt"),
        btnPromptModal = document.querySelectorAll(".btn-promptModal"),
        btnStayOnPage = document.querySelector("#btnStayOnPage");

    btnPromptModal.forEach(button =>
        button.onclick = function () {
            promptModal.style.display = "block";
        }
    );

    btnStayOnPage.onclick = function () {
        promptModal.style.display = "none";
    } 
});