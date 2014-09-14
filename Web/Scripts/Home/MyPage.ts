var MyPageSearchOptionBoxManager: SearchOrderOptionBox;
$(()=>
{
    $(".listitem").hover(function()
    {
        $(this).find(".edit-buttons").css("visibility", "visible");
    },function()
        {
            $(this).find(".edit-buttons").css("visibility", "hidden");
        }
        );
    MyPageSearchOptionBoxManager = new SearchOrderOptionBox($(".search-menu"), "MyPage", "", false);
    MyPageSearchOptionBoxManager.initBoxSelected();
});

function deleteArticle(articleId: string)
{
    $().alertwindow("この記事を削除しますか？", "y/n", (response) =>
    {
        if (response == "yes")
            $("#remove-article-" + articleId).submit();
    });
} 

function editArticle(articleId: string)
{
    $().alertwindow("編集をするとこの記事に付けられた付箋はすべて消えてしまいます。\nよろしいですか？", "y/n", (response) =>
    {
        if (response == "yes")
            $("#edit-article-" + articleId).submit();
    });
}

function appendArticle(articleId:string)
{
    $("#append-article-" + articleId).submit();
}
var searchPageOrderOptionBox: SearchOrderOptionBox;
$(() =>
{
    var changepage: number =10;//前後に何ページ移動するか

    $(".page-before").click(() =>
    {
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
        window.location.href = "/MyPage?order=" + order + "&skip=" + skip;
    });

    $(".page-after").click(() =>
    {
        var order: number = $("#order").val();
        var skip: number = parseInt($("#skip").val());
        skip = skip + changepage;
        window.location.href = "/MyPage?order=" + order + "&skip=" + skip;
    });

    $(".main").ready(() =>
    {
        var count: number = parseInt($("#count").val());//全体の数
        var skip: number = parseInt($("#skip").val());//現在の一番上の記事
        if (skip < changepage)
        {
            $(".page-before").hide();
        }
        if (skip + changepage > count)
        {
            $(".page-after").hide();
        }
    });
});


