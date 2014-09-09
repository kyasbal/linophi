var name: string;
var len: number;
var isTooShortNickName,
    isTooLongNickName,
    isInvalidEmailAddr: boolean;
var isConfirmedFormValue: boolean = false;
$(function()
{
    $(".name-box").focusout(function()
    {
        name = $(this).val();
        len = name.length;
        if (len <= 3)
        {
            $(".warn2").css("display", "inline");
        }
        else
        {
            $(".warn2").css("display", "none");
            isTooShortNickName = true;
        }
        if (len > 15)
        {
            $(".warn1").css("display", "inline");
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
}

var accountConfirmationPage: AccountConfirmation;

$(() =>
{
    $(".email-box").focusout(function()
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
        }
    });
    //ページの高さ調節処理
    accountConfirmationPage = new AccountConfirmation();
    accountConfirmationPage.adjustMargin();
    $(window).resize(() => { accountConfirmationPage.adjustMargin() });
});


$(()=>
{
    $("#regi").click(() =>
    {
        if (isConfirmedFormValue)$("#regi-form").submit();
    });
    accountConfirmationPage.changeSubmitStyle(false);

    $('#AcceptTerm').click(function()
    {
        if ($(this).prop('checked') == false)
        {
            accountConfirmationPage.changeSubmitStyle(false);
        }
        else
        {
            if (isTooShortNickName == isTooLongNickName == isInvalidEmailAddr == true)
            {
                accountConfirmationPage.changeSubmitStyle(true);
            }
        }
    });
});