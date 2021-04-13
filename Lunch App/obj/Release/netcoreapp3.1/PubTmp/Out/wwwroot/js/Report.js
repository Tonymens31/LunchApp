
$(document).ready(() => {
    inIt();
})


let inIt = () => {
    $('#btnViewReport').click(() => {
    
        showModal();
    })
}

let showModal = () => {
    $('#ReportModal').modal('show');
}