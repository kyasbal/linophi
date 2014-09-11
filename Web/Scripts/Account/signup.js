var name;
var len;
var isTooShortNickName, isTooLongNickName, isInvalidEmailAddr;
var isConfirmedFormValue = false;
$(function () {
    $(".name-box").keyup(function () {
        name = $(this).val();
        len = name.length;
        if (len <= 3) {
            $(".warn2").css("display", "inline");
            isTooShortNickName = false;
        } else {
            $(".warn2").css("display", "none");
            isTooShortNickName = true;
        }
        if (len > 15) {
            $(".warn1").css("display", "inline");
            isTooLongNickName = false;
        } else {
            $(".warn1").css("display", "none");
            isTooLongNickName = true;
        }
    });
});

var add;
var AccountConfirmation = (function () {
    function AccountConfirmation() {
    }
    AccountConfirmation.prototype.adjustMargin = function () {
        var sumHeight = window.innerHeight;
        var needMargin = sumHeight - $("header").height() - $(".foot").height() - $(".container").height() - 5;
        needMargin = Math.max(0, needMargin);
        $(".container").css({ "margin-bottom": needMargin });
    };

    AccountConfirmation.prototype.changeSubmitStyle = function (isEnable) {
        if (isEnable) {
            $('#regi').removeAttr('disabled').addClass("submit-enabled");
            isConfirmedFormValue = true;
        } else {
            $('#regi').attr('disabled', 'disabled').removeClass("submit-enabled");
            isConfirmedFormValue = false;
        }
    };

    AccountConfirmation.prototype.chkValid = function () {
        if (isTooShortNickName && isTooLongNickName && isInvalidEmailAddr && $('#AcceptTerm').prop('checked')) {
            accountConfirmationPage.changeSubmitStyle(true);
        } else {
            accountConfirmationPage.changeSubmitStyle(false);
        }
        console.log(isTooShortNickName, isTooLongNickName, isInvalidEmailAddr, $('#AcceptTerm').prop('checked'));
    };
    return AccountConfirmation;
})();

var accountConfirmationPage;

$(function () {
    $(".email-box").keyup(function () {
        add = $(this).val();
        if (add.match(/^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/g)) {
            $(".warn3").css("display", "none");
            isInvalidEmailAddr = true;
        } else {
            $(".warn3").css("display", "inline");
            isInvalidEmailAddr = false;
        }
    });

    //ページの高さ調節処理
    accountConfirmationPage = new AccountConfirmation();
    accountConfirmationPage.adjustMargin();
    $(window).resize(function () {
        accountConfirmationPage.adjustMargin();
    });
});

$(function () {
    $("#regi").click(function () {
        if (isConfirmedFormValue)
            $("#regi-form").submit();
    });
    accountConfirmationPage.changeSubmitStyle(false);

    $('#NickName, #Email').keyup(function () {
        accountConfirmationPage.chkValid();
    });
    $('#NickName, #Email, #AcceptMail, #AcceptTerm').focusout(function () {
        accountConfirmationPage.chkValid();
    });
    $('#NickName, #Email, #AcceptMail, #AcceptTerm').focus(function () {
        setTimeout(function () {
            accountConfirmationPage.chkValid();
        }, 500);
    });
});
//# sourceMappingURL=signup.js.map
