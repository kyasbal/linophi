var top_height;

$(function ()
 {
     top_height = $('.top').height();
});

if(top_height>=200)
{
    $(function()
    {
        $('.navbar-thumb').css('margin-bottom', '100px');
    });
};