var verticalStreacher;
var horizontalStreacher;
$(function () {
    verticalStreacher = new HeightStretcher($("article"), $("#container"));
    verticalStreacher.addSubElement($("header"));
    verticalStreacher.addSubElement($("footer"));
    verticalStreacher.updateTargetProperty();
    horizontalStreacher = new WidthStretcher($("#right"), $("article"));
    horizontalStreacher.addSubElement($("#left"));
    horizontalStreacher.ExtraMargin = 2;
    horizontalStreacher.updateTargetProperty();
});
//# sourceMappingURL=index.js.map
