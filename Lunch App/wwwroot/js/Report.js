
$(document).ready(() => {
    inIt();
})


let inIt = () => {
    $('#btnViewReport').click(() => {
        alert("hello")
        showModal();
    })
}

let showModal = () => {
    $('#ReportModal').modal('show');
}