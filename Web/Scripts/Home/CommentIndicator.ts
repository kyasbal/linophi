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

interface IAverageColor
{
    newtralColor(paragraphId: string): number[];
    lightness(diff: number, color: number[]): number[];
    saturation(diff: number, color: number[]): number[];
}

class AverageColor
{
    private colorValue;
    constructor()
    {
        this.colorValue =
        {
            "surprised": [246, 100, 151],
            "anger": [198, 66, 63],
            "fun": [255, 179, 58],
            "bethink": [233, 236, 0],
            "good": [161, 231, 62],
            "sad": [129, 200, 255],
            "noidea": [107, 83, 255],
        };
    }

    newtralColor(paragraphId: string): number[]
    {
        var sum: number[] = [0, 0, 0],
            counter: number = 0;

        for (var emotion in this.colorValue)
        {
            var emotionCount = labelSourceParser.getLabelCount(paragraphId, emotion),
                emotionValue = this.colorValue[emotion];
            for (var i = 0; i < 3; i++)
            {
                sum[i] += emotionCount * emotionValue[i];
            }
            counter += emotionCount;
        }

        var avr: number[] = [0,0,0];
        for (var i = 0; i < 3; i++)
        {
            avr[i] = ( sum[i] / (counter||1) )|0;
        }
        return avr;
    }

    lightness(diff: number, color: number[]): number[]
    {
        for (var i = 0; i < 3; i++)
        {
            color[i] += diff;
            if (color[i] <= 0)
            {
                color[i] = 0;
            } else if (255 <= color[i])
            {
                color[i] = 255;
            }
        }
        return color;
    }

    saturation(ratio: number, color: number[]): number[]
    {
        // １．rgbの平均をとる
        // ２．rgbそれぞれに対して平均との差分にratioをかける
        // ３．それらに平均を足してやる

        var sum = 0;
        color.forEach((val) => { sum += val });
        var avr = (sum / 3)|0;

        for (var i = 0; i < 3; i++)
        {
            color[i] = (color[i] - avr) * ratio + color[i];
        }
        return color;
    }

}

var averageColor: AverageColor = new AverageColor;

console.log(averageColor.newtralColor(getParagraphId("x_p-LSKQxbyY8r")));


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
        var $ele: JQuery = $('.article-container > [class*="p-"]:nth-child(' + (i + 1) + ')');
        var className: string = $ele.attr("class");
        // console.log(className);
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
                    '<button class="' + className + '">コメントする</button>' +
                    '<div class="triangle"></div>'
                );

                labelSourceParser.eachByParagraph(getParagraphId(className), (emotion, count) =>
                {
                    var thisColor = "rgb(" +
                        averageColor.lightness(-100, averageColor.newtralColor(getParagraphId(className)))
                        .join(",") + ")";
                    console.log(thisColor);
                    $('.article-container .' + className + '-comments').css({
                        "background": thisColor
                    });
                    $('.article-container .' + className + '-comments .triangle').css({
                        "border-top-color": thisColor
                    });
                });
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