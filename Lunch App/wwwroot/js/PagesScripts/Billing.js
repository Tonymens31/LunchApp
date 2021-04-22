$(document).ready(function () {
    $("#panelPayments, #panelBilling, #panelAccount, #panelCompany").hide();

    $("#bck_btnpanelCompany").click(function () {
        $("#panelPayments, #panelBilling, #panelAccount, #panelCompany").hide();
        $("#panelApplications").fadeIn("slow");
    });

    $("#btnpanelApplications,#bck_btnpanelAccount").click(function () {
        $("#panelApplications, #panelPayments, #panelBilling, #panelAccount").hide();
        $("#panelCompany").fadeIn("slow");
    });

    $("#btnpanelCompany, #bck_btnpanelBilling").click(function () {
        $("#panelApplications, #panelPayments, #panelBilling, #panelCompany").hide();
        $("#panelAccount").fadeIn("slow");
    });

    $("#btnpanelAccount, #bck_panelPayments").click(function () {
        $("#panelPayments, #panelAccount, #panelAccount, #panelCompany").hide();
        $("#panelBilling").fadeIn("slow");
    });

    $("#btnpanelBilling").click(function () {
        $("#panelAccount, #panelBilling, #panelCompany, #panelApplications").hide();
        $("#panelPayments").fadeIn("slow");
    });

    /*Buttons to move back*/
    $("#bckpanelCompany").click(function () {
        $("#panelApplications, #panelPayments, #panelBilling, #panelCompany").hide();
        $("#panelAccount").fadeIn("slow");
    });

    $("#bckpanelAccount").click(function () {
        $("#panelPayments, #panelAccount, #panelAccount, #panelCompany").hide();
        $("#panelBilling").fadeIn("slow");
    });

    $("#bckpanelBilling").click(function () {
        $("#panelAccount, #panelBilling, #panelCompany, #panelApplications").hide();
        $("#panelPayments").fadeIn("slow");
    });

    $("#bckpanelPayments").click(function () {
        $("#btnpanelBilling").click();
    });
    //Example value = '500' standard='en' or 'fr' if you want decimal places dec must be > 0
    function moneyInTxt(value, standard = 'en', dec = 2) {
        //value = moneyInNum(value, standard);
        nf = new Intl.NumberFormat(standard, {
            minimumFractionDigits: dec,
            maximumFractionDigits: 2
        });

        return nf.format(value);
    }


    function moneyInNum(value, str = 'en') {
        if (str === 'en') {
            return Number(value.replace(/,/g, ''));
        }
        else if (str === 'fr') {
            return Number(value.replace(/\s/g, '').replace(/,/g, '.'));
        }
        else if (str === 'es') {
            return Number(value.replace(/\./g, '').replace(/,/g, '.'));
        }
    }

    setTimeout(function () { $("#website").val(""); }, 1000);
    let priceHR = 0, pricePay = 0, priceAmount = 0, priceSupport = 0;

    $(document).on("input", "#noOfEmployees", function () {
        this.value = this.value.replace(/\D/g, '');
    });

    $("#noOfEmployees").focusout(function () {
        this.value = !this.value || Number(this.value) < 1 ? 1 : this.value;
    });

    $("#chkHR, #chkPayroll").prop("checked", true).change();
    (function(){
        $("#divBoughtApps").prepend(`<div class="form-group" id="sideHR">
                                            <div class="col-md-12">
                                                <strong style="text-transform: capitalize;">HR - (lite edition)</strong>
                                                <span class="pull-right sidesP" id="prHR" id-p="275">$375.00</span>
                                            </div>
                                        </div>`);
        priceHR = 375;

        $("#divBoughtApps").prepend(`<div class= "form-group" id="sidechkPayroll">
                                            <div class="col-md-12">
                                                <strong style="text-transform: capitalize;">Payroll - (lite edition)</strong>
                                                <span class="pull-right sidesP" id="prPayroll" id-p="275">$375.00</span>
                                            </div>
                                        </div >`);
        pricePay = 375;
        priceAmount = priceHR + pricePay + priceSupport;
        $("#totalAmount").text(moneyInTxt(priceAmount, 'en')); 
    })();


    $("#support").change(function () {        
        if (Number(this.value) === -1) {
            $("#divBoughtSupport").html(""); 
            priceSupport = 0;
        } else {
            let thisTxt = $("#support option:selected").text();

            $("#divBoughtSupport").html(`<div class="form-group">
                                            <div class="col-md-12">
                                                <strong id="cartLicense">${thisTxt} Support Package</strong>
                                                <span class="pull-right" id="supportPrice">$1,250.00</span>
                                            </div>
                                        </div>`); 
            priceSupport = 1250;
        }
        priceAmount = priceHR + pricePay + priceSupport;
        $("#totalAmount").text(moneyInTxt(priceAmount, 'en'));   
    }).change();

    $("#panApplications").on('change', '#chkHR', function () { 
        if ($('#chkHR').is(':checked')) {
            $("#divBoughtApps").prepend(`<div class="form-group" id="sideHR">
                                            <div class="col-md-12">
                                                <strong style="text-transform: capitalize;">HR - (lite edition)</strong>
                                                <span class="pull-right sidesP" id="prHR" id-p="275">$375.00</span>
                                            </div>
                                        </div>`);
            priceHR = 375;
                
        } else {
            $("#sideHR").remove();
            priceHR = 0;
        }

        priceAmount = priceHR + pricePay + priceSupport;
        $("#totalAmount").text(moneyInTxt(priceAmount, 'en')); 
    }).change();

    $("#panApplications").on('change', '#chkPayroll', function () {
        if ($('#chkPayroll').is(':checked')) {
            $("#divBoughtApps").prepend(`<div class= "form-group" id="sidechkPayroll" >
                                            <div class="col-md-12">
                                                <strong style="text-transform: capitalize;">Payroll - (lite edition)</strong>
                                                <span class="pull-right sidesP" id="prPayroll" id-p="275">$375.00</span>
                                            </div>
                                        </div >`);
            pricePay = 375;
        } else {
            $("#sidechkPayroll").remove();
            pricePay = 0;
        }
        priceAmount = priceHR + pricePay + priceSupport;
        $("#totalAmount").text(moneyInTxt(priceAmount, 'en')); 
    }).change();

    
    primaryUsers = [];
    let loadPrimaryUsers = () => {  
        let string = `<option selected value="00000000-0000-0000-0000-000000000000" 
                                data-fName="" data-lName="" data-group="00000000-0000-0000-0000-000000000000"
                                data-uName="" data-email="" data-phone="">      
                                    Enter New User Info
                             </option>`;

        mthdPutOrPost(`${_path_url}pricing/GetPrimaryUsers`)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);

                if (Number(doneData.Status) === 200 || Number(doneData.Status) === 201) {
                    primaryUsers = JSON.parse(doneData.Body);

                    primaryUsers.forEach(function (u, i) {
                        string += `<option value="${u.id}" 
                                data-fName="${u.firstName}" data-lName="${u.lastName}" data-group="${u.groupId}"
                                data-uName="${u.userName}" data-email="${u.email}" data-phone="${u.phoneNumber}">      
                                    ${u.firstName} ${u.lastName} (${u.userName})
                             </option>`;
                    });                    
                }
                $("#selUserType").html(string);

                $("#selUserType").change(function () {
                    $(".uInfo").val('').prop("disabled", $("#selUserType").val() !== "00000000-0000-0000-0000-000000000000");
                    $("#uName").val($("#selUserType").find(':selected').data('uname'));
                    $("#fName").val($("#selUserType").find(':selected').data('fname'));
                    $("#lName").val($("#selUserType").find(':selected').data('lname'));
                    $("#pEmail").val($("#selUserType").find(':selected').data('email'));
                    $("#pPhone").val($("#selUserType").find(':selected').data('phone'));

                    $("#selUserType").val() !== "00000000-0000-0000-0000-000000000000" ? $("#hisPhone").hide() : $("#hisPhone").show();
                }).change();
            });
    }

    loadPrimaryUsers();     
    
    $("#btnPayment").click(function () {
        let phone1 = $("#phone1").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim(),
            phone2 = $("#phone2").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim(),
            pPhone = $("#pPhone").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim(),
            billPhone = $("#billPhone").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim(),
            momoPhone = $("#momoPhone").closest('.iti.iti--allow-dropdown').children('.iti__flag-container').children('.iti__selected-flag').attr("title").split(': ')[1].trim(),
            selectedAppsList = [];

        $('.appsIds').each(function () {
            var sThisVal = (this.checked ? $(this).val() : null);
            if (sThisVal) {

                selectedAppsList.push({
                    "appId": sThisVal,
                    "appPrice": 375
                });
            }
        });
         

        if (Number($("#support").val()) !== -1) {
            selectedAppsList.push({
                "appId": $("#support").val(),
                "appPrice": 1250
            });
        }
         

        var PaymentData = {
            "name": $("#legalName").val(),
            "logo": "",
            "description": "A license for" + $("#legalName").val(),
            "size": 0,
            "industry": $("#industry").val(),
            "serviceType": "C",
            "noOfUsers": Number($("#noOfUsers").val()),
            "website": $("#website").val(),
            "countryID": $("#cCountry").val(),
            "noOfEmployees": Number($("#noOfEmployees").val()),
            "createBillings": {
                "city": "Accra",
                "countryId": $("#cCountry").val(),
                "street": $("#stAddress").val(),
                "addressLine1": $("#pAddress").val(),
                "addressLine2": "",
                "zipCode": !$("#dgAddress").val() ? "N/A" : $("#dgAddress").val(),
                "stateProv": ""
            },
            "primaryUsers": {
                "id": $("#selUserType").val(),
                "groupid": $("#selUserType").find(':selected').data('group'),
                "firstName": $("#fName").val(),
                "userName": $("#uName").val(),
                "middleName": $("#mName").val(),
                "lastName": $("#lName").val(),
                "phoneNumber": $("#pPhone").val() ? pPhone + $("#pPhone").val() : "",
                "email": $("#pEmail").val()
            },
            "invoiceMaster": {
                "licenseId": $("#cmbLicense").find(':selected').data('id'),
                "totalAmount": 1,// moneyInNum($("#totalAmount").text(), 'en'),
                "createAccountLicenses": {
                    "licenseId": $("#cmbLicense").find(':selected').data('id')
                },
                "createInvoicesPaymentss": {
                    "amountPaid": 1,//moneyInNum($("#totalAmount").text(), 'en'),
                    "note": "This is License for account company. Thanks",
                    subscriptionType: $("#periodic").val(),
                    "createApps": selectedAppsList,
                    "createPaymentMethods": {
                        "type": "Bank",
                        "momoNumber": $("#momoPhone").val() ? momoPhone + $("#momoPhone").val() : "",
                        "bankAccountNo": "",
                        "bankAccountName": ""
                    }
                }
            }
        } 
        //return false;


        $("#btnPayment").prop('disabled', true).html(`Please wait&nbsp;<i class="fa fa-spinner fa-spin"></i>`);
        $('#myCartModal input, #myCartModal button, #myCartModal select').prop('disabled', true);
        localStorage.setItem('newTrial', JSON.stringify(PaymentData));

        console.log(PaymentData, selectedAppsList);

        // return false;
        mthdPutOrPost(`${_path_url}pricing/EmmergentPayment`, PaymentData)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);

                if (Number(doneData.Status) === 200 || Number(doneData.Status) === 201) {
                    doneData = JSON.parse(doneData.Body);
                    $('#myCartModal input, #myCartModal button, #myCartModal select').prop('disabled', false);
                    $("#btnPayment").prop('disabled', false).html(`Proceed To Pay`); 
                    $('#welcomeModal').modal('show');
                    window.open(doneData, 'blank');
                } else {
                    $("#btnPayment").prop('disabled', false).html(`Proceed To Pay`);
                }
            }).fail(function () {
                $("#btnPayment").prop('disabled', false).html(`Proceed To Pay`);
            });
    });
});