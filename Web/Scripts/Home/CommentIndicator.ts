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
    var commentSourceParser = new CommentSourceParser();

    // コメントの表示に関する
    $('.article-container > *').each((i) =>
    {
        var $ele: JQuery = $('[class^="x_"]:nth-child(' + (i + 1) + ')');
        var className: string = $ele.attr("class");

        if (className)
        {
            $('.widget .' + className).append('<div class="' + className + '-comments"></div>');

            commentSourceParser.eachDoInComments(className.substr(4), (name, time, id, comment) =>
            {
                $('.widget .' + className + '-comments').append(
                    '<div class="response">' +
                    '<p class="res-title"> <span></span> <b>' + name + '</b> <small>[' + time + '] ID:' + id + ' </small> </p>' +
                    '<p class="res-text">' +
                    comment +
                    '</p>' +
                    '</div>'
                );
            });
            $('.widget .' + className + '-comments .res-title > span').each((j) =>
            {
                $('.' + className + '-comments .response:nth-child(' + (j + 1) + ') span').html((j + 1) + "");
            });

            $('.widget .' + className + '-comments').append(
                '<button class="' + className + '">コメントする</button>'
            );
        }

    });

    $('.widget button').on("click", (e) =>
    {
        var formHtml =
            '<form id="the-form">' +
                '<input type="text" name="name" value="" placeholder="Name" />' +
                '<textarea name="message" placeholder="Messages"></textarea>' +
                '<button>送信</button>' +
            '</form>';

        $().alertwindow(formHtml, "none", "コメントする", () =>
        {
            $('#the-form').submit(function (event) {
                event.preventDefault();
                var $form = $(this);
                if ($form.find("textarea").val())
                {
                    var $button = $form.find('button');
                    console.info(location.pathname.substr(1), $form.find("input").val(), ((Object)(e.currentTarget)).className.substr(4), $form.find("textarea").val());
                    $.ajax({
                        url: "/api/Comment/AttachComment",
                        type: "post",
                        data: {
                            "ArticleId": location.pathname.substr(1),
                            "UserName": $form.find("input").val() || "no name",
                            "ParagraphId": ((Object)(e.currentTarget)).className.substr(4),
                            "Comment": $form.find("textarea").val() || "no message"
                        },
                        timeout: 10000,

                        beforeSend: () =>
                        {
                            $button.attr('disabled', 'true');
                        },
                        complete: () =>
                        {
                            $button.attr('disabled', 'false');
                        },

                        success: () =>
                        {
                            $form.find("input, textarea").val("");
                        },
                        error: () =>
                        {
                            alert("送信失敗しました");
                        }
                    });
                } else
                {
                    alert("空欄を埋めてください");
                }
            });
        });
    });
});