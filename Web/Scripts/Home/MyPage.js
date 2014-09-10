var MyPageSearchOptionBoxManager;
$(function () {
    $(".listitem").hover(function () {
        $(this).find(".edit-buttons").css("visibility", "visible");
    }, function () {
        $(this).find(".edit-buttons").css("visibility", "hidden");
    });
    MyPageSearchOptionBoxManager = new SearchOrderOptionBox($(".search-menu"), "MyPage", "", false);
    MyPageSearchOptionBoxManager.initBoxSelected();
});

function deleteArticle(articleId) {
    $().alertwindow("この記事を削除しますか？", "y/n", function (response) {
        if (response == "yes")
            $("#remove-article-" + articleId).submit();
    });
}

function editArticle(articleId) {
    $().alertwindow("編集をするとこの記事に付けられた付箋はすべて消えてしまいます。\nよろしいですか？", "y/n", function (response) {
        if (response == "yes")
            $("#edit-article-" + articleId).submit();
    });
}

function appendArticle(articleId) {
    $("#append-article-" + articleId).submit();
}
var searchPageOrderOptionBox;
$(function () {
    var changepage = 10;

    $(".page-before").click(function () {
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        if (skip - changepage >= 0) {
            skip = skip - changepage;
        } else {
            skip = 0;
        }
        window.location.href = "/MyPage?order=" + order + "&skip=" + skip;
    });

    $(".page-after").click(function () {
        var order = $("#order").val();
        var skip = parseInt($("#skip").val());
        skip = skip + changepage;
        window.location.href = "/MyPage?order=" + order + "&skip=" + skip;
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
//# sourceMappingURL=MyPage.js.map
