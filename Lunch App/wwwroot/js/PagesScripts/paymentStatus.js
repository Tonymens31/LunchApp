$(document).ready(function () {
    let pageLocation = window.location.href;

    console.log("console location here", { pageLocation });

    //pageLocation = `http://psl-app-vm3/persol-hcm-marketplace/paymentstatus?status_code=2&status_message=Fail&trans_ref_no=46887685&order_id=81cc8&signature=CUlay9IbTcj1XcgUSA58oe73p0w%3d&payment_mode=AIRTEL`;

    let getURLParamByName = (name, url = window.location.href) => {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    let status_message = getURLParamByName('status_message', pageLocation);
    let trans_ref_no = getURLParamByName('trans_ref_no', pageLocation);

    console.log({ status_message }, { trans_ref_no });

    let PaidSuccessfully = () => {
        if (!status_message || !trans_ref_no) {
            $("#successMessage").html(`<h3 style="color:red">Unknown Error. We shall look at it and revert. Sorry.</h3><br><br>
                                        <a href="#" class="btn btn-small btn-gray btnGoHome">Go Home</a>`);
            return false;
        }

        if (status_message.toLowerCase() === `fail`) {
            $("#successMessage").html(`<h3 style="color:red">Sorry, payment was not successful, please try again later.</h3><br><br>
                                        <a href="#" class="btn btn-small btn-gray btnGoHome">Go Home</a>`);
            return false;
        }  

        if (status_message.toLowerCase() !== `success`) {
            $("#successMessage").html(`<h3 style="color:red">Unknown Error. We shall look at it and revert. Sorry.</h3><br><br>
                                        <a href="#" class="btn btn-small btn-gray btnGoHome">Go Home</a>`);
            return false;
        } 


        $("#successMessage").html(`<h3 style="color:green">Great, we have successfully confirmed your payment, Thank you.</h3><br><br>
                                        <a href="#" class="btn btn-small btn-gray btnGoHome">Go Home</a>`);

        $(".btnGoHome").html(`<span style="font-size:16px">Please wait...</span>`).prop('disabled', true).css("cursor","wait");
        mthdPutOrPost(`${_path_url}pricing/GetSuccessPayment`, { RefCode: trans_ref_no })
            .done(function (doneData) {
                console.log({ doneData });
                $(".btnGoHome").html(`<span style="font-size:16px">Go Home</span>`).prop('disabled', false).css("cursor", "default");
                doneData = JSON.parse(doneData);
            });
    }

    PaidSuccessfully();  

    $(document).on('click', '.btnGoHome', function () {
        window.location = `${_path_url}myaccount`;
    });

});