function deleteArticle(articleId:string)
{
    //TODO:確認処理
    $("#remove-article-" + articleId).submit();
} 

function editArticle(articleId: string) {
    $("#edit-article-" + articleId).submit();
} 