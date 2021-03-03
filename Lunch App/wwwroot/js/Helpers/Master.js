$.ajaxSetup({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RequestVerificationToken': $('input:hidden[name="__RequestVerificationToken"]').val()
    }
});

let companyId = '00000000-0000-0000-0000-000000000000';

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

getFormattedDate = (str) => {
    let dateString = new Date(str).toUTCString();
    dateString = dateString.split(' ').slice(0, 4).join(' ');
    return `${dateString.trim()}`;
}


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: '',
    minimumFractionDigits: 2
})

function makeAPIRequest(URL, data = "") {
    return $.ajax({
        url: URL,
        method: 'POST',
        tryCount: 0,
        retryLimit: 3,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json"
    })
        .done(function (e) {
            //pageLoader("hide");
            //e = JSON.parse(e);
            e = JSON.stringify

            if (Number(e.Status) === 401) {
                //location.href = `${_path_url}home/logout`;
                return false;
            }

            if (Number(e.Status) === 404) {
               // messages(msg.notFound);
                return false;
            }

            if (Number(e.Status) === 500) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }
                return false;
            }

            //if (parentModalId !== "")
            //    $(`${parentModalId}`).modal("hide");

            //alert(msg.success);
        })
        .fail(function (xhr) {
            //pageLoader("hide");
            //messages(xhr.status, 'error');
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }
            return;
        });

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