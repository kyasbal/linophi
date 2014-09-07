var top_height;

$(() =>
{
    //記事全体の感情状態の表示
});
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