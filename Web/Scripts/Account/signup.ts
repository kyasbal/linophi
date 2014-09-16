var name: string;
var len: number;
var isTooShortNickName: boolean,
    isTooLongNickName: boolean,
    isInvalidEmailAddr: boolean;
var isConfirmedFormValue: boolean = false;
$(function()
{
    $(".name-box").keyup(function()
    {
        name = $(this).val();
        len = name.length;
        if (len < 2)
        {
            $(".warn2").css("display", "inline");
            isTooShortNickName = false;
        }
        else
        {
            $(".warn2").css("display", "none");
            isTooShortNickName = true;
        }
        if (len > 15)
        {
            $(".warn1").css("display", "inline");
            isTooLongNickName = false;
        }
        else
        {
            $(".warn1").css("display", "none");
            isTooLongNickName = true;
        }
    });
});

var add: string;
class AccountConfirmation
{
    adjustMargin()
    {
        var sumHeight = window.innerHeight;
        var needMargin = sumHeight - $("header").height() - $(".foot").height() - $(".container").height()-5;//-20;
        needMargin=Math.max(0, needMargin);
        $(".container").css({ "margin-bottom": needMargin });
    }
    
    changeSubmitStyle(isEnable: boolean)
    {
        if (isEnable)
        {
            $('#regi').removeAttr('disabled').addClass("submit-enabled");
            isConfirmedFormValue = true;
        } else
        {
            $('#regi').attr('disabled', 'disabled').removeClass("submit-enabled");
            isConfirmedFormValue = false;
        }
    }

    chkValid()
    {
        if (isTooShortNickName && isTooLongNickName && isInvalidEmailAddr && $('#AcceptTerm').prop('checked')) {
            accountConfirmationPage.changeSubmitStyle(true);
        } else {
            accountConfirmationPage.changeSubmitStyle(false);
        }
        console.log(isTooShortNickName, isTooLongNickName, isInvalidEmailAddr, $('#AcceptTerm').prop('checked'));

    }
}

var accountConfirmationPage: AccountConfirmation;

$(() =>
{
    $(".email-box").keyup(function()
    {
        add = $(this).val();
        if (add.match(/^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/g))
        {
            $(".warn3").css("display", "none");
            isInvalidEmailAddr = true;
        }
        else
        {
            $(".warn3").css("display", "inline");
            isInvalidEmailAddr = false;
        }
    });
    //ページの高さ調節処理
    accountConfirmationPage = new AccountConfirmation();
    accountConfirmationPage.adjustMargin();
    $(window).resize(() => { accountConfirmationPage.adjustMargin(); });
});


$(()=>
{
    $("#regi").click(() =>
    {
        if (isConfirmedFormValue) $("#regi-form").submit();
    });
    accountConfirmationPage.changeSubmitStyle(false);

    $('#NickName, #Email').keyup(() =>
    {
        accountConfirmationPage.chkValid();
    });
    $('#NickName, #Email, #AcceptMail, #AcceptTerm').focusout(() => {
        accountConfirmationPage.chkValid();
    });
    $('#NickName, #Email, #AcceptMail, #AcceptTerm').focus(() =>
    {
        setTimeout(() =>
        {
             accountConfirmationPage.chkValid();
        }, 500);
    });
});