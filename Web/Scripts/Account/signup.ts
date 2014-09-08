var name: string;
var len: number;
var flag1,
    flag2,
    flag3: boolean;

$(function()
{
    $(".name-box").focusout(function()
    {
        name = $(this).val();
        alert(name);
        len = name.length;
        if (len <= 3)
        {
            $(".warn2").css("display", "inline");
        }
        else
        {
            $(".warn2").css("display", "none");
            flag1 = true;
        }
        if (len > 10)
        {
            $(".warn1").css("display", "inline");
        }
        else
        {
            $(".warn1").css("display", "none");
            flag2 = true;
        }
    });
});

var add: string;
$(function()
{
    $(".email-box").focusout(function()
    {
        add = $(this).val();
        if (add.match(/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/g))
        {
            $(".warn3").css("display", "none");
            flag3 = true;
        }
        else
        {
            $(".warn3").css("display", "inline");
        }
    });
});


$(function()
{
    $("#regi").attr('disabled', 'disabled').css('cursor', 'default');

    $('#AcceptTerm').click(function()
    {
        if ($(this).prop('checked') == false)
        {
            $('#regi').attr('disabled', 'disabled').css('cursor', 'default');
        }
        else
        {
            if (flag1 == flag2 == flag3 == true)
            {
                $('#regi').removeAttr('disabled').css('cursor', 'pointer');
            }
        }
    });
});