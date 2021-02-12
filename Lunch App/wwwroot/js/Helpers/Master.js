
window.location.href.indexOf("localhost") > -1 ? _path_url = `${window.location.origin}/` :
    _path_url = `${window.location.origin}/`;

function readExternalFile(file, mime, callback) {
    let overrideMime = ''



    mime === 'json' ? overrideMime = "application/json" : mime === 'html' ? overrideMime = "text/html" : overrideMime = "text/plain"

    let dataFile = new XMLHttpRequest();
    dataFile.overrideMimeType(overrideMime);
    dataFile.open("GET", file, true);
    dataFile.onreadystatechange = function () {
        if (dataFile.readyState === 4 && dataFile.status == "200") {
            callback(dataFile.responseText);
        }
    }
    dataFile.send(null);
}




function makeAPIRequest(url, method, data = "", callback) {

    switch (method) {
        case 'GET':
            getRequest(url, callback)
            break;
        case 'POST':
            postRequest(url, method, data, callback)
        case 'PUT':
            putRequest(url, method, data, callback)
            break
        case 'DELETE':
            deleteRequest(url, callback)
            break;
    }

    function getRequest(url, callback) {
        fetch(url).then(data => data.text()).then(data => callback(data)).catch((error) => callback(error));
    }

    function deleteRequest(url, callback) {
        fetch(url, {
            method: 'DELETE',
        }).then(res => res.text()).then(data => callback(data)).catch((error) => callback(error));
    }

    function postRequest(url, method, data, callback) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(data => data.text()).then(data => callback(data));
    }
    function putRequest(url, method, data, callback) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(data => data.text()).then(data => callback(data));
    }

}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function setColorToToastr(state) {
    if (state == true) {
        $('.iziToast-theme-light').addClass('success-color');
    } else {
        $('.iziToast-theme-light').removeClass('success-color');
    }
}

function messenger(message) {
    switch (message.toLowerCase()) {
        case 'success':
            setColorToToastr(true);
            iziToast.show({
                timeout: 1000,
                color: 'green',
                icon: 'fa fa-check',
                position: 'topRight',
                message: 'Submitted successfully'
            });
            break;
        case 'error':
            setColorToToastr(false)
            iziToast.show({
                color: 'red',
                icon: 'fa fa-times',
                position: 'topRight',
                message: 'An error occured'
            });
            break;
        case 'warning':
            setColorToToastr(false)
            iziToast.show({
                color: 'yellow',
                icon: 'fa fa-warning',
                position: 'topRight',
                message: 'Something went wrong'
            });
            break;
        case 'unknown':
            iziToast.show({
                color: 'blue',
                icon: 'fa fa-info',
                position: 'topRight',
                message: 'No match found!'
            });
            break;
    }
}

function GetCurrentPageName() {
    var url = window.location.pathname;
    return url.substring(url.lastIndexOf('/') + 1);
}

lightMenu(GetCurrentPageName().toLowerCase());

function lightMenu(page) {
    page ? page : page = 'dashboard'
    $('#' + page).addClass('active');
    $('#' + page + ' > a').addClass('active');
}

$(function () {
    $('ul.nav li').on('click', function () {
        $(this).parent().find('li.active').removeClass('active');
        $(this).addClass('active');
    });
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};


function validatePhone(data) {
    if (data.length === 10) {
        return (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g).test(data)
    }
    else if (data.length > 10) {
        return false
    }
    return false
}

function message(type, mess) {
    toastr[type](mess)
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}


function moneyInTxt(value, standard, dec = 0) {
    nf = new Intl.NumberFormat(standard, {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2
    });
    return nf.format(Number(value) ? value : 0.00);
};


$(".numbers").on("keypress", function (evt) {
    var self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((Number(evt.which) !== 46 || Number(self.val().indexOf('.')) !== -1) && (evt.which < 48 || evt.which > 57)) {
        evt.preventDefault();
    }
});