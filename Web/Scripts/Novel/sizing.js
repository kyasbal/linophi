var editSwitch = true;

$(".prev-switch").click(function () {
    if (editSwitch == true) {
        $(".edit-preview-container").animate({
            width: "46.5%"
        }, 1000);
        $(".edit-text-container").animate({
            width: "42.5%"
        }, 1000);
        $(".prev-switch").animate({
            marginLeft: "29%"
        }, 1000);
        $(this).text("←小さくする");

        editSwitch = false;
    } else {
        $(".edit-preview-container").animate({
            width: "40%"
        }, 1000);
        $(".edit-text-container").animate({
            width: "49%"
        }, 1000);
        $(".prev-switch").animate({
            marginLeft: "25%"
        }, 1000);
        $(this).text("大きくする→");
        editSwitch = true;
    }
});
//# sourceMappingURL=sizing.js.map
