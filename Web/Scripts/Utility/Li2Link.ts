$(() =>
{
    $("li, .listitem").click(function ()
    {
        if ($(this).find("a").attr("href") && !$(this).find("a").attr("onClick"))
        {
            location.href = $(this).find("a").attr("href");
        }
    });
});
