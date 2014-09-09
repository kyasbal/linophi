var searchPageOrderOptionBox;
$(function () {
    var changepage = 20;
    searchPageOrderOptionBox = new SearchOrderOptionBox($(".search-menu"), "Search", "searchText");
    searchPageOrderOptionBox.initBoxSelected();
    $(".page-before").click(function () {
        var searchText = $("#searchedText").val();
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        if (skip - changepage >= 0) {
            skip = skip - changepage;
        } else {
            skip = 0;
        }
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });

    $(".page-after").click(function () {
        var searchText = $("#searchedText").val();
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        skip = skip + changepage;
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });

    $(".main").ready(function () {
        var count = parseInt($("#count").val());
        var skip = parseInt($("#skip").val());
        if (skip < changepage) {
            $(".page-before").hide();
        }
        if (skip + changepage > count) {
            $(".page-after").hide();
        }
    });
});
//# sourceMappingURL=Search.js.map
