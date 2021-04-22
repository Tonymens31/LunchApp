$(document).ready(function () {    
    $("#btnBuy").click(function () {
        window.location.href = `${_path_url}pricing/billing`;
    });

    let loadLicenses = () => {
        mthdPutOrPost(`${_path_url}pricing/LoadPaymentsByUserId`)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);
                doneData = JSON.parse(doneData.Body);

                let thisHtml = '';
                $(doneData).each(function (k, val) {
                    //console.log(val)
                    thisHtml += `<div class="license">
                                    <div class="license-summary" data-id="${val.id}">
                                        <div class="summ-heading">
                                            <h4>${val.company}</h4>
                                        </div>
                                        <div class="summ-btn"><i class="fa fa-chevron-down"></i></div>
                                    </div>
                                    <div class="license-body"></div>
                                    <div class="license-footer"></div>
                                </div>`; 
                });

                document.querySelector('#divLicenses').innerHTML = thisHtml;
                $('.license-summary').eq(0).trigger('click');                     
            });
    }

    loadLicenses();

    $(document).on("click", ".license-summary", function () {
        let clickedSummary = $(this),
            invoiceId = clickedSummary.data("id"); 

        $(".license-summary").parent().children(".license-body").css("display", "none");
        $(".license-summary").parent().children(".license-footer").css("display", "none");
        $(".license-summary").children('.summ-btn').children('i').addClass('fa-chevron-down').removeClass('fa-chevron-up');

        let AppsBought = ``;

        mthdPutOrPost(`${_path_url}pricing/GetInvoiceDetails`, { InvoiceId:invoiceId})
            .done(function (dData) { 
                dData = JSON.parse(dData);

                if (Number(dData.Status) === 200 || Number(dData.Status) === 201) { 
                    dData = JSON.parse(dData.Body)[0];  
                    
                    $(dData.invoiceDetailsDtos).each(function (k,val) {
                        AppsBought += `<li data-id="${val.id}"><i class="fa fa-dot-circle"></i>&nbsp; ${val.product}</li>`;
                    });

                    if (clickedSummary.children(".summ-btn").children("i").hasClass("fa-chevron-down")) {
                       // <p>Estimated Expiry Date: <span class="body-details-text" id="licenseType"></span></p>   
                        let contentHTML = `<div>
                            <p>License/ Edition Type: <span class="body-details-text" id="licenseType">${dData.licenseType}</span></p>
                            <p>Price: <span class="body-details-text" id="amountTotal">$${moneyInTxt(dData.amountTotal)} USD</span></p>
                            <p>Bought On: <span class="body-details-text" id="transDate">${strDate(dData.transDate)}</span></p>
                            <p>Payment Status: <span class="body-details-text" id="paymentVerified">${payStatus(dData.paymentVerified)}</span></p>
                            <p>Payment Received On: <span class="body-details-text" id="invoiceDate">${Number(dData.paymentVerified) === 1 ? strDate(dData.invoiceDate) : "" }</span></p>
                                        
                            <p>License ID: <span class="body-details-text" id="docNum">${dData.docNum}</span></p>
                        </div>
                        <div>
                            <p>Number of users: <span class="body-details-text" id="numberUsers">${ moneyInTxt(dData.numberUsers, 0)}</span></p>
                            <p>Number of employees: <span class="body-details-text" id="numberEmployees">${ moneyInTxt(dData.numberEmployees, 0)}</span></p>
                            <p>Number of apps: <span class="body-details-text" id="quantityTotal">${dData.quantityTotal}</span></p>
                            <p>Payment Frequency: <span class="body-details-text" id="annualOrMonthly">${capitalize(dData.annualOrMonthly)}</span></p>
                            <p>Assigned Primary User: <span class="body-details-text" id="licenseType"></span></p>                            
                        </div>
                        <div>
                            <p>Applications & Support: </p>
                            <p class="body-details-text" id="licenseType">
                                <ul style="padding-left: 1.05rem !important; color: #0039a6;">
                                    ${AppsBought}                                    
                                </ul>
                            </p>  
                        </div>`;

                        clickedSummary.parent().children(".license-body").html(contentHTML);   
                        clickedSummary.parent().children(".license-body").css("display", "grid");
                        clickedSummary.parent().children(".license-footer").css("display", "block");                        
                        clickedSummary.parent().children(".license-footer").html(`<a asp-controller="MyAccount" asp-action="Index" class="btn transparent">Upgrade</a>
                            <a asp-controller="MyAccount" asp-action="Index" class="btn transparent">${Number(dData.paymentVerified) === 1 ? "Renew" : "Make Payment" }</a>`);

                        clickedSummary.children('.summ-btn').children('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    }
                    else {
                        clickedSummary.parent().children(".license-footer").css("display", "none").html("");
                        clickedSummary.parent().children(".license-body").css("display", "none").html("");
                        clickedSummary.children('.summ-btn').children('i').addClass('fa-chevron-down').removeClass('fa-chevron-up');
                    }
                }                
            }); 
    });
});