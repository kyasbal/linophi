$(function()
{
    $(".listitem").hover(function()
    {
        $(this).find(".edit-buttons").css("visibility", "visible");
    },function()
        {
            $(this).find(".edit-buttons").css("visibility", "hidden");
        }
    );
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

function inputValue()
{
    
}