
interface EventTarget
{
    src: string;
}
interface ParagraphEachHandler
{
    (emotion:string,count:number,itr:number):void;
}

interface ParagraphCallHandler
{
    ():void;
}

interface ILabelSourceParser
{
    getLabelCount(paragraphId: string, emotion: string): number;

    eachByParagraph(paragraphId: string, hander: ParagraphEachHandler): void;

    callByParagraph(paragraphId:string,handler:ParagraphCallHandler):void;
}

class LabelSourceParser implements ILabelSourceParser
{
    private jsonSource:any;
    constructor()
    {
        this.jsonSource = JSON.parse($("#label-info").text());
    }

    getLabelCount(paragraphId: string, emotion: string): number
    {
        for (var i = 0; i < this.jsonSource.length; i++)
        {
            if (this.jsonSource[i]["ParagraphId"]==paragraphId)
            {
                var data = JSON.parse(this.jsonSource[i]["Data"]);
                data = _.sortBy(data, d => (Object)(d).Value).reverse();
                for (var j = 0; j < data.length; j++)
                {
                    if (data[j].Key == emotion)
                    {
                        return data[j].Value;
                    }
                }
                return 0;
            }
        }
        return 0;
    }

    eachByParagraph(paragraphId: string, handler: ParagraphEachHandler): void
    {
        for (var i = 0; i < this.jsonSource.length; i++) {
            if (this.jsonSource[i].ParagraphId == paragraphId) {
                var data = JSON.parse(this.jsonSource[i]["Data"]);
                data = _.sortBy(data, d => (Object)(d).Value).reverse();
                for (var j = 0; j < data.length; j++)
                {
                    handler(data[j].Key, data[j].Value, j);
                }
                return null;
            }
        }
        return null;
    }

    callByParagraph(paragraphId: string, handler: ParagraphCallHandler): void
    {
        for (var i = 0; i < this.jsonSource.length; i++) {
            if (this.jsonSource[i]["ParagraphId"] == paragraphId)
            {
                handler();
                return null;
            }
        }
        return null;
    }
}

var labelSourceParser: ILabelSourceParser;

$(() =>
{
    labelSourceParser = new LabelSourceParser();
});
$(window).load(() => // 後読みじゃないとまともにポジションとれない
{

    var htmlHeight = $('.foot').offset().top + $('.foot').outerHeight();

    $('html').css({
        "height": htmlHeight + "px"
    });
    var articleId = location.pathname.substr(1);

    /*
     * ふせんをクリックされたら左側に影的なものを出して周りを暗くする
     * 次のタイミングにクリックされたら貼り付ける
     * 貼り付けられた（クリック領域でクリックされたら）そこに貼る
     * それはこっちで用意した場所に追加されるが、すでに貼られていた場合は値を増やす。
     */

    var pasteMode: boolean = false;

    var labelType: string, src: string;
    var dropboxPos: number = $('.contentswrapper').offset().top,
        dropboxHeight: number = $('.contentswrapper').outerHeight(true);

    var posY: number = dropboxPos + 10;

    $('.article-container > *').each((i) => {
        var $ele: JQuery = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');

        var className = $ele.attr("class");

        // alert(className);

        var eleHeight: number = $ele.outerHeight(true),
            elePos: number = $ele.offset().top;

        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className).css({
            "position": "absolute",
            "top": elePos - dropboxPos + "px",
            "height": eleHeight + "px",
            "width": "300px",
        });
        labelSourceParser.eachByParagraph(className.substr(4), (emotion: string, count: number, itr: number) =>
        {
            $('.dropbox > .' + className).append(
                '<div class="' + emotion + '" style="background-image:url(\'/Content/imgs/Home/' + emotion + '.png\');background-size:130px 43px;height:43px;width:130px;"><span>' +
                count +
                '</span></div>'
                );
        });
    });

    // 貼り付けモードへ
    $('.postit-list [class]').click((event) =>
    {
        pasteMode = true;

        $('.fade-layer').css({
            "visibility": "visible",
            "opacity": 1
        });

        labelType = ((Object)(event.currentTarget)).className;
        src = '/Content/imgs/Home/' + labelType + '.png';
        console.log(event);
        $('.fade-layer, .dropbox').mousemove((e) =>
        {
            if (dropboxPos <= e.pageY && e.pageY <= dropboxPos + dropboxHeight)
            {
                posY = e.pageY;
            }

            if (pasteMode)
            {
                $('.dropbox').css({
                    "opacity": 0.7, 
                    "z-index": 1100
                });
                $(".dropbox > .postit-pasting").css({
                    "position": "absolute",
                    "top": posY - dropboxPos + "px",
                    "left": "20px",
                    "z-index": 1100,
                    "visibility": "visible",
                    "background-image": "url(" + src + ")",
                    "background-size": "130px 43px"
                });
            }
            var pHeights: number = dropboxPos;

            $('.dropbox > [class^="x_p-"]').each((i) => {
                var $target: JQuery = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 2) + ')'); // i == 0のとき１つ目のふせんを表している
                var pHeight: number = $target.outerHeight(true);
                var bg = "none";
                if (pHeights <= posY && posY <= pHeights + pHeight && pasteMode)
                    bg = "#fcc";
                
                $target.css({
                    "background": bg
                });

                pHeights += pHeight;

            });
        });

        console.log("called", labelType);
    });


    // 貼り付けて戻る
    $('.dropbox').click(() =>
    {
        $('.fade-layer').css("opacity", 0);
        setTimeout(() => {
            $('.fade-layer').css("visibility", "hidden");
        }, 500);

        $('.dropbox').css("opacity", 1);
        setTimeout(() =>
        {
            $('.dropbox').css("z-index", 0);
        }, 500);

        $('.dropbox > .postit-pasting').css({
            "z-index": -100,
            "visibility": "hidden"
        });


        if (pasteMode)
        {
            var pHeights: number = dropboxPos;

            $('.dropbox > [class^="x_p-"]').each((i) =>
            {
                var $target: JQuery = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ')');
                var pHeight: number = $target.outerHeight(true);

                var thisClass: string = $target.attr("class");

                var postitExistence: number =
                    $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ') > .' + labelType).length;

                if (pHeights <= posY && posY <= pHeights + pHeight) // 対象のｐ要素で貼り付けた時の処理
                {
                    if (postitExistence)
                    {
                        labelSourceParser.callByParagraph(thisClass.substr(4), () =>
                        {
                            $('.dropbox > .' + thisClass + ' > .' + labelType + ' > span').html(String(
                                Number($('.dropbox > .' + thisClass + ' > .' + labelType + ' > span').text()) + 1
                                ));
                        });
                    } else
                    {
                        $target.append(
                            '<div class="' + labelType + '" style="background-image:url(' + src + ');background-size:130px 43px;height:43px;width:130px;"><span>1</span></div>'
                        );
                    }

                    $.ajax({
                        type: "post",
                        url: "api/Label/AttachLabel",
                        data: {
                            "ArticleId": articleId,
                            "ParagraphId": thisClass.substr(4),
                            "LabelType": labelType,
                            "DebugMode": true
                        },
                        success: (data) =>
                        {
                            console.log(data);
                        }
                    });
                }

                pHeights += pHeight;

                // console.log($target.attr("class"), pHeight, pHeights, posY, src);
            });

            pasteMode = false;
        }
    });


    // 貼り付けないで戻る

    $('.fade-layer').click(() =>
    {
        $('.fade-layer').css("opacity", 0);
        setTimeout(() => {
            $('.fade-layer').css("visibility", "hidden");
        }, 500);

        $('.dropbox').css("opacity", 1);
        setTimeout(() => {
            $('.dropbox').css("z-index", 0);
        }, 500);

        $('.dropbox > .postit-pasting').css({
            "z-index": -100,
            "visibility": "hidden"
        });

        pasteMode = false;
    });



    // ふせんを貼る部分をhoverした時の処理
    $('.postit-list [class]').hover((event) =>
    {
        var thisClass: string = ((Object)(event.currentTarget)).className;
        $('.postit-list div.' + thisClass).css("visibility", "visible");
    }, (event) =>
    {
        var thisClass: string = ((Object)(event.currentTarget)).className;
        $('.postit-list div.' + thisClass).css("visibility", "hidden");
    });
});