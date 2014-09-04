function inputValue() {
    var add = location.href;
    var val = $('.search-menu').val();
    var searchedText = $("#searchedText").val();
    window.location.href = "Search?searchText=" + searchedText + "&order=" + val;
}
//# sourceMappingURL=Search.js.map
