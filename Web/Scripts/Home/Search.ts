var searchPageOrderOptionBox: SearchOrderOptionBox;
$(() =>
{
    var changepage: number = 20;//前後に何ページ移動するか
    searchPageOrderOptionBox = new SearchOrderOptionBox($(".search-menu"), "Search", "searchText");
    searchPageOrderOptionBox.initBoxSelected();
    $(".page-before").click(() =>
    {
        var searchText: string = $("#searchedText").val();
        var order: number = $("#order").val();
        var skip: number = parseInt($("#skip").val());
        if (skip - changepage >= 0)
        {
            skip = skip - changepage;
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
        skip = skip + changepage;
        window.location.href = "/Search?searchText=" + searchText + "&order=" + order + "&skip=" + skip;
    });

    $(".main").ready(() =>
    {
        var count: number = parseInt($("#count").val());//全体の数
        var skip: number = parseInt($("#skip").val());//現在の一番上の記事
        if (skip<changepage)
        {
            $(".page-before").hide();
        }
        if (skip+changepage>count)
        {
            $(".page-after").hide();
        }
    });
});


