interface ICommentSourceParser
{
    eachDoInComments(paragraphId: string, handler: ()=>void): void;
}

class CommentSourceParser implements ICommentSourceParser
{
    private commentJson: any;
    constructor()
    {
        this.commentJson = JSON.parse($("#comment-info").text());
    }

    eachDoInComments(paragraphId: string, handler: (name: string, time: string, id: string, comment: string) => void): void
    {
        for (var i: number = 0, len: number = this.commentJson.length; i < len; i++) {
            if (this.commentJson[i]["ParagraphId"] == paragraphId)
            {
                handler(this.commentJson[i]["Name"], this.commentJson[i]["PostTime"], this.commentJson[i]["AutoId"], this.commentJson[i]["Comment"]);
            }
        }
    }
}



$(() =>
{
    var commentJson = JSON.parse($("#comment-info").text());

    var commentSourceParser = new CommentSourceParser();

    $('.article-container > *').each((i) =>
    {
        var $ele: JQuery = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');
        var className: string = $ele.attr("class");

        var thisHtml: string = "";

        commentSourceParser.eachDoInComments(className.substr(4), (name, time, id, comment) =>
        {
            thisHtml +=
                '<div class="response">' +
                    '<p class="res-title"> counter <b>' + name + '</b> <small>[' + time + '] ID:' + id + ' </small> </p>' +
                    '<p class="res-text">' +
                        comment +
                    '</p>' +
                '</div>';
        });

        if (thisHtml) // デッドコードじゃないです！
        {
            $('.widget .' + className).append('<div class="' + className + '-comments">' + thisHtml + '</div>');
        }

    });
});