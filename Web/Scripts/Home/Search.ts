var searchPageOrderOptionBox: SearchOrderOptionBox;
$(() =>
{
    searchPageOrderOptionBox = new SearchOrderOptionBox($(".search-menu"), "Search", "searchText");
    searchPageOrderOptionBox.initBoxSelected();
    $(".page-before").click(() =>
    {
        var searchText: string = $("#searchedText").val();
        var order: number = $("#order").val();
        var skip: number = parseInt($("#skip").val());
        if (skip - 20 >= 0)
        {
            skip = skip - 20;
        }
        else
        {
            skip = 0;
        }
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });

    $(".page-after").click(() =>
    {
        var searchText: string = $("#searchedText").val();
        var order: number = $("#order").val();
        var skip: number = parseInt($("#skip").val());
        skip = skip + 20;
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });
});


