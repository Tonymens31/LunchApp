let loginData = {}, userDetail = {};

userDetail = JSON.parse(localStorage.getItem("userDetails"));
loginData = JSON.parse(localStorage.getItem("loginData"));

if (!loginData)
    window.location = `${window.location.href}landingpage`;