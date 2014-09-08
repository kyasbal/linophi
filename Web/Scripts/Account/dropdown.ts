$(".login-drop").click(function ()
{
    $(">ul").show();
    alert("あいうえお");
}, function()
{
    $(">ul").children('ul').hide();
});