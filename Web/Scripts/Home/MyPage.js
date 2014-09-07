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
//# sourceMappingURL=MyPage.js.map
