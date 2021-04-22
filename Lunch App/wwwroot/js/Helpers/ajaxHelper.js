const msg = {
    success: "Data submitted successfully",
    fail: "Unable to save ",
    noMatch: "No match found!",
    sessionExpired: "Unauthorized! Please login again.",
    unexpected: "Something unexpected happened, please contact the admin",
    successDel: "Data deleted successfully",
    nameExist: "Username already used. Please change and try again.",
    userCreated:"New user created successfully"
};

const capitalize = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


function pageLoader (strType = "show") { 
    let theName = strType.trim().toLowerCase()
    return theName === 'show' ?
        $("body").LoadingOverlay("show", { background: "rgba(0,0,0,0.5)" }) :
        theName === 'hide' ?
            $("body").LoadingOverlay("hide", true) :
            console.log('Contact CoderBot if Loader does not work!'); 
}

const errorCodes = (code) => {
    switch (Number(code)) {
        case 401:
            console.log(msg.sessionExpired);
            window.location = `http://localhost:4161/landingpage`;
            break;
        case 404:
            console.log(msg.noMatch);
            break;
        case 409:
            console.log(msg.nameExist);
            break;
        case 500:
            console.log(msg.unexpected);
            break;
    }
};

//use this for posts and puts
const mthdPutOrPost = (URL, data, parentModalId = "") => {
    pageLoader("show");
    return $.ajax({
        url: URL,
        method: 'POST',
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json"
    })
        .done(function (e) {
            pageLoader("hide");
            e = JSON.parse(e);

            if (Number(e.Status) === 401) {
                console.log(msg.sessionExpired);
                location.href = `${_path_url}myaccount`;
                return false;
            }

            if (parentModalId !== "")
                $(`${parentModalId}`).modal("hide");

            //console.log(msg.success);
        })
        .fail(function (xhr) {
            errorCodes(xhr.status);
        });
};

const populateTable = (tableName, data) => {
    tableName.rows().remove().draw();
    if (data)
        tableName.rows.add(data).draw().nodes();
};

const populateSelectBox = (selectId, placeholder, data) => {
    $(`#${selectId}`).html("");
    var options = `<option value="0" selected >${placeholder}</option>`;
    if (data.length > 0) {
        $(data).each(function (key, value) {
            options += '<option value="' + value.pkId + '">' + value.szName + '</option>';
        });
    }
    $(`#${selectId}`).html(options);
};

function alertAlert(parentId, icon, message) {
    let infoClass = icon;
    if (icon==="success") {
        infoClass = "check";
    }
    $(`${parentId} .all-alerts`)
        .fadeOut()
        .html(`<div class="alert alert-${icon}" style="text-align: center !important;">
                  <strong><i class="fa fa-${infoClass}-circle"></i></strong> ${message}
                </div>`)
        .fadeIn();
}

function moneyInTxt(value, dec = 2, standard = 'en') {
    //value = moneyInNum(value, standard);
    nf = new Intl.NumberFormat(standard, {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2
    });

    return nf.format(value);
}

function hasLCase(str) {
    return (/[a-z]/.test(str));
}

function hasUCase(str) {
    return (/[A-Z]/.test(str));
}

function hasNum(str) {
    return (/[0-9]/.test(str));
}

function hasSpecial(str) {
    return (/[\\,\\.\\;\\@\\(\\)\\=\\+\\%\\!\\#\\$\\^\\&\\*\\-\\_\\/\\?\\<\\>\\~]/.test(str));
}

function togglePasswordVisibilty(inputId) {
    var x = document.getElementById(inputId);
    x.type === "password" ? x.type = "text" : x.type = "password";
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: "UTC", timeZoneName: "short" };

function strDate(dateVal) {
    return new Date(dateVal).toLocaleDateString("en-us", dateOptions);
}

function payStatus(status) {
    switch (Number(status)) {
        case 0:
            return `Pending Payment`;
        case 1:
            return `Paid`;
        default:
            return `Status Unknown`;
    }
}




