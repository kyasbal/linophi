var searchPageOrderOptionBox;
$(function () {
    searchPageOrderOptionBox = new SearchOrderOptionBox($(".search-menu"), "Search", "searchText");
    searchPageOrderOptionBox.initBoxSelected();
    $(".page-before").click(function () {
        var searchText = $("#searchedText").val();
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        if (skip - 20 >= 0) {
            skip = skip - 20;
        } else {
            skip = 0;
        }
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });

    $(".page-after").click(function () {
        var searchText = $("#searchedText").val();
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        skip = skip + 20;
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });
});
//# sourceMappingURL=Search.js.map
