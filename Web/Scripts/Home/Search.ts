var searchPageOrderOptionBox: SearchOrderOptionBox;
$(() =>
{
    searchPageOrderOptionBox = new SearchOrderOptionBox($(".search-menu"), "Search", "searchText");
    searchPageOrderOptionBox.initBoxSelected();
})