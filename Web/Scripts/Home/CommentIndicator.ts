interface EachDoInCommentDelegate
{
    (name:string,time:string,id:string,comment:string):void;
}

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

    eachDoInComments(paragraphId: string, handler:EachDoInCommentDelegate): void
    {
        for (var k: number = 0, len: number = this.commentJson.length; k < len; k++) {
            if (this.commentJson[k]["ParagraphId"] == paragraphId)
            {
                handler(this.commentJson[k]["Name"], this.commentJson[k]["PostTime"], this.commentJson[k]["AutoId"], this.commentJson[k]["Comment"]);
            }
        }
    }
}

function logSelector(selector: string):JQuery
{
    var $elemSelector = $(selector);
    console.log("selector:" + selector+"\nlength"+$elemSelector.length);
    return $elemSelector;
}

$(() =>
{
    var commentSourceParser = new CommentSourceParser();

    // コメントの表示に関する
    $('.article-container > *').each((i) =>
    {
        var $ele: JQuery = $('[class*="p-"]:nth-child(' + (i + 1) + ')');
        var className: string = $ele.attr("class");
        if (className)
        {
            var splitted = className.split(" ");
            var isMatched: boolean = false;
            for (var j = 0; j < splitted.length; j++)
            {
                if (splitted[j].match(/(x_)?[pd]-[a-zA-Z0-9]{10}$/))
                {
                    isMatched = true;
                    className = splitted[j];
                    break;

                }   
            }
            if (isMatched&&className)
            {
                $('.article-container .' + className).append('<div class="' + className + '-comments"></div>');

                commentSourceParser.eachDoInComments(getParagraphId(className), (name, time, id, comment) =>
                {
                    $('.article-container .' + className + '-comments').append(
                        '<div class="response">' +
                        '<p class="res-title"> <span></span> <b>' + name + '</b> <small>[' + time + '] ID:' + id + ' </small> </p>' +
                        '<p class="res-text">' +
                        comment +
                        '</p>' +
                        '</div>'
                    );
                });
                $('.article-container .' + className + '-comments .res-title > span').each((j) =>
                {
                    $('.' + className + '-comments .response:nth-child(' + (j + 1) + ') span').html((j + 1) + "");
                });

                $('.article-container .' + className + '-comments').append(
                    '<button class="' + className + '">コメントする</button>'
                );
            }
        }

    });

    $('.widget button').on("click", (e) =>
    {
        var formHtml =
            '<input type="text" name="name" value="" placeholder="Name" />' +
            '<textarea name="message" placeholder="Messages"></textarea>';

        $().alertwindow(formHtml, "送信", "コメントする", () =>
        {
            var $form = $('.alert-box');
            if ($(".alert-box textarea").val())
            {
                var $button: JQuery = $form.find('button');
                var sendData = {
                    "ArticleId": location.pathname.substr(1),
                    "UserName": s($form.find("input").val()) || "no name",
                    "ParagraphId": getParagraphId((Object)(e.currentTarget).className),
                    "Comment": s($form.find("textarea").val()) || "no message"
                };
                var dd = new Date();
                var y = dd.getFullYear(), m = dd.getMonth() + 1, d = dd.getDate();
                $.ajax({
                    url: "/api/Comment/AttachComment",
                    type: "post",
                    data: sendData,
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

                        var commentNum = $('.article-container .x_' + sendData.ParagraphId + '-comments .response').length + 1;
                        $('.article-container .x_' + sendData.ParagraphId + '-comments > button').before(
                            '<div class="response">' +
                            '<p class="res-title"> <span>' + commentNum + '</span> <b>' + sendData.UserName + '</b> <small>['+y+'/'+m+'/'+d+'] ID:更新して表示 </small> </p>' +
                            '<p class="res-text">' +
                            sendData.Comment +
                            '</p>' +
                            '</div>'
                        );
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