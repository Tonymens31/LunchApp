let prices = [], billings = [];
prices = JSON.parse(localStorage.getItem('priceVariables'));
billings = JSON.parse(localStorage.getItem('BillingWithSupport'));

//load all price variables
const loadPriceVariables = () => {
    // return false;
    if (!prices) {
        mthdPutOrPost(`${_path_url}pricing/LoadPriceVariables`)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);

                if (Number(doneData.Status) === 200 || Number(doneData.Status) === 201) {
                    localStorage.setItem("priceVariables", doneData.Body);
                    prices = JSON.parse(doneData.Body);
                }
            });
    }   
    console.log(prices);
};

//load all billings and support
const LoadBillingWithSupport = () => {
    // return false;
    if (!billings) {
        mthdPutOrPost(`${_path_url}pricing/BillingWithSupport`)
            .done(function (doneData) {
                doneData = JSON.parse(doneData);

                if (Number(doneData.Status) === 200 || Number(doneData.Status) === 201) {
                    localStorage.setItem("BillingWithSupport", doneData.Body);
                    billings = JSON.parse(doneData.Body);
                }
            });
    } 
    console.log(billings);
};

loadPriceVariables();
LoadBillingWithSupport(); 
 