const displayPrices = () => {
    if (prices) {
        $('.price-lite').children('.price-body').children('.price-amt').children('.monthly-amt').text(`$${prices[0].priceVarEdition[2].price.toFixed(2)}`);
        $('.price-standard').children('.price-body').children('.price-amt').children('.monthly-amt').text(`$${prices[0].priceVarEdition[0].price.toFixed(2)}`);
        $('.price-enterprise').children('.price-body').children('.price-amt').children('.monthly-amt').text(`$${prices[0].priceVarEdition[1].price.toFixed(2)}`);
    }
};

let PriceCalculator = () => {

}


displayPrices();

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function (event) {
//    if (event.target == modal) {
//        promptModal.style.display = "none";
//    }
//}
