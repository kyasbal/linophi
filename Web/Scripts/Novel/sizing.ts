var editSwitch = true;

$(".prev-switch").click(function()
{
    if (editSwitch == true)
    {
        $(".edit-preview-container").stop(true).animate(
        {
            width: "46.5%"
        }, 500);
        $(".edit-text-container").stop(true).animate({
            width: "41%"
        }, 500);
        $(".prev-switch").stop(true).animate({
            marginLeft: "29%"
        }, 500);
        $(this).text("←小さくする");

        editSwitch = false;
    }
    else
    {
        $(".edit-preview-container").stop(true).animate(
        {
            width: "40%"
        }, 500);
        $(".edit-text-container").stop(true).animate({
            width: "49%"
        }, 500);
        $(".prev-switch").stop(true).animate({
            marginLeft: "25%"
        }, 500);
        $(this).text("大きくする→");
        editSwitch = true;
    }
});