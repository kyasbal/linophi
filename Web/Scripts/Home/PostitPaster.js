
var CountWholeEmotionsResult = (function () {
    function CountWholeEmotionsResult() {
        this.surprised = 0;
        this.anger = 0;
        this.fun = 0;
        this.bethink = 0;
        this.good = 0;
        this.sad = 0;
        this.noidea = 0;
        this.sum = 0;
    }
    return CountWholeEmotionsResult;
})();

var LabelSourceParser = (function () {
    function LabelSourceParser() {
        this.jsonSource = JSON.parse($("#label-info").text());
    }
    LabelSourceParser.prototype.getLabelCount = function (paragraphId, emotion) {
        for (var i = 0; i < this.jsonSource.length; i++) {
            if (this.jsonSource[i]["ParagraphId"] == paragraphId) {
                var data = JSON.parse(this.jsonSource[i]["Data"]);
                for (var j = 0; j < data.length; j++) {
                    if (data[j].Key == emotion) {
                        return data[j].Value;
                    }
                }
                return 0;
            }
        }
        return 0;
    };

    LabelSourceParser.prototype.eachByParagraph = function (paragraphId, handler) {
        for (var i = 0; i < this.jsonSource.length; i++) {
            if (this.jsonSource[i].ParagraphId == paragraphId) {
                var data = JSON.parse(this.jsonSource[i]["Data"]);
                data = _.sortBy(data, function (d) {
                    return (Object)(d).Value;
                }).reverse();
                for (var j = 0; j < data.length; j++) {
                    handler(data[j].Key, data[j].Value, j);
                }
                return null;
            }
        }
        return null;
    };

    LabelSourceParser.prototype.callByParagraph = function (paragraphId, handler) {
        for (var i = 0; i < this.jsonSource.length; i++) {
            if (this.jsonSource[i]["ParagraphId"] == paragraphId) {
                handler();
                return null;
            }
        }
        return null;
    };

    LabelSourceParser.prototype.countWholeEmotions = function () {
        var result = new CountWholeEmotionsResult();
        for (var i = 0; i < this.jsonSource.length; i++) {
            var data = JSON.parse(this.jsonSource[i]["Data"]);
            for (var j = 0; j < data.length; j++) {
                result[data[j].Key] += data[j].Value;
                result["sum"] += data[j].Value;
            }
        }
        return result;
    };
    return LabelSourceParser;
})();

var labelSourceParser;
$(function () {
    labelSourceParser = new LabelSourceParser();
});

var LabelBoxController = (function () {
    function LabelBoxController() {
    }
    LabelBoxController.prototype.labelPosition = function (speciesOfLabel, boxClass) {
        var boxSelector = ".dropbox ." + boxClass;
        if (43 * speciesOfLabel >= $(boxSelector).height()) {
            var sortArray = [];
            $(boxSelector + ' > [class]').each(function (i, element) {
                sortArray[sortArray.length] = element;
            });
            sortArray.reverse();

            $(boxSelector + ' > *').css({
                "margin-right": "-53px",
                "float": "left"
            });
            $(boxSelector + ':after').css({
                "content": "''",
                "display": "block",
                "clear": "both"
            });

            for (var i = 0, len = sortArray.length; i < len; i++) {
                $(boxSelector).append(sortArray[i]);
            }
        }
    };
    return LabelBoxController;
})();
var labelBoxController = new LabelBoxController();

var AjaxManager = (function () {
    function AjaxManager() {
    }
    AjaxManager.prototype.sendPostitNumber = function (articleId, thisClass, labelType, postitExistence, $target, src) {
        $.ajax({
            type: "post",
            url: "api/Label/AttachLabel",
            data: {
                "ArticleId": articleId,
                "ParagraphId": thisClass.substr(4),
                "LabelType": labelType
            },
            success: function (data) {
                if (data.isSucceed) {
                    wholeCount[labelType]++; //ドーナツ用のデータの更新
                    updateArticleDounught(false); //更新したデータの適用
                    var updatedCount = $(".label-count").text();
                    $(".label-count").text(parseInt(updatedCount) + 1);
                    if (postitExistence) {
                        labelSourceParser.callByParagraph(thisClass.substr(4), function () {
                            $('.dropbox > .' + thisClass + ' > .' + labelType + ' > span').html(String(Number($('.dropbox > .' + thisClass + ' > .' + labelType + ' > span').text()) + 1));
                        });
                    } else {
                        $target.append('<div class="' + labelType + '" style="background-image:url(' + src + ');background-size:130px 43px;height:43px;width:130px;"><span>1</span></div>');
                    }
                } else {
                    $().alertwindow("１つの段落に２つ以上のふせんをつける事はできません", "ok"); // jquery.alertwindow.js
                }
            }
        });
    };
    return AjaxManager;
})();

var ajaxManager = new AjaxManager();

$(window).load(function () {
    var htmlHeight = $('.foot').offset().top + $('.foot').outerHeight();

    $('html').css({
        "height": htmlHeight + "px"
    });
    var articleId = location.pathname.substr(1);

    var pasteMode = false;

    var labelType, src;
    var dropboxPos = $('.contentswrapper').offset().top, dropboxHeight = $('.contentswrapper').outerHeight(true);

    var posY = dropboxPos + 10;

    $('.article-container > *').each(function (i) {
        var $ele = $('.article-container > [class*="p-"]:nth-child(' + (i + 2) + ')');
        if (!$ele[0])
            return true;
        var elementName = $ele[0].tagName;
        if (elementName == "hr")
            return true;

        var className = $ele.attr("class");

        var eleHeight = $ele.outerHeight(true), elePos = $ele.offset().top;

        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className).css({
            "position": "absolute",
            "top": elePos - dropboxPos + "px",
            "height": eleHeight + "px",
            "width": "180px"
        });

        labelSourceParser.eachByParagraph(className.substr(4), function (emotion, count, itr) {
            $('.dropbox > .' + className).append('<div class="' + emotion + '" style="background-image:url(\'/Content/imgs/Home/' + emotion + '-d.svg\');background-size:130px 43px;height:43px;width:130px;"><span>' + count + '</span></div>');
        });

        labelBoxController.labelPosition($('.dropbox > .' + className + ' > *').length, className);
    });

    // 貼り付けモードへ
    $('.postit-list [class]').click(function (event) {
        pasteMode = true;

        $('.fade-layer').css({
            "visibility": "visible",
            "opacity": 1
        });

        labelType = ((Object)(event.currentTarget)).className;
        src = '/Content/imgs/Home/' + labelType + '-d.svg';

        $('.dropbox').css({
            "opacity": 0.7,
            "z-index": 1100
        });

        $('.fade-layer, .dropbox').mousemove(function (e) {
            if (dropboxPos <= e.pageY && e.pageY <= dropboxPos + dropboxHeight) {
                posY = e.pageY;
            }

            if (pasteMode) {
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

            var pHeights = dropboxPos;

            $('.dropbox > [class*="p-"]').each(function (i) {
                var $target = $('.dropbox > [class*="p-"]:nth-child(' + (i + 2) + ')');
                var pHeight = $target.outerHeight(true);
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
    $('.dropbox').click(function () {
        $('.fade-layer').css("opacity", 0);
        setTimeout(function () {
            $('.fade-layer').css("visibility", "hidden");
        }, 500);

        $('.dropbox').css("opacity", 1);
        setTimeout(function () {
            $('.dropbox').css("z-index", 0);
        }, 500);

        if (pasteMode) {
            var pHeights = dropboxPos;
            pasteMode = false;

            $('.dropbox > .postit-pasting').css({
                "z-index": -100,
                "visibility": "hidden"
            });

            $('.dropbox > *').each(function (i) {
                var $target = $('.dropbox > [class*="p-"]:nth-child(' + (i + 2) + ')');
                if (!$target[0])
                    return true;
                var elementName = $target[0].tagName;
                if (elementName == "hr")
                    return true;

                var pHeight = $target.outerHeight(true);

                var thisClass = $target.attr("class");

                var postitExistence = $('.dropbox > [class*="p-"]:nth-child(' + (i + 1) + ') > .' + labelType).length;

                if (pHeights <= posY && posY <= pHeights + pHeight) {
                    ajaxManager.sendPostitNumber(articleId, thisClass, labelType, postitExistence, $target, src);
                }

                pHeights += pHeight;
                // console.log($target.attr("class"), pHeight, pHeights, posY, src);
            });
        }
    });

    // 貼り付けないで戻る
    $('.fade-layer').click(function () {
        $('.fade-layer').css("opacity", 0);
        setTimeout(function () {
            $('.fade-layer').css("visibility", "hidden");
        }, 500);

        $('.dropbox').css("opacity", 1);
        setTimeout(function () {
            $('.dropbox').css("z-index", 0);
        }, 500);

        $('.dropbox > .postit-pasting').css({
            "z-index": -100,
            "visibility": "hidden"
        });

        pasteMode = false;
    });

    // ふせんを貼る部分をhoverした時の処理
    $('.postit-list [class]').hover(function (event) {
        var thisClass = ((Object)(event.currentTarget)).className;
        $('.postit-list div.' + thisClass).css("visibility", "visible").animate({ opacity: 1 }, 500);
    }, function (event) {
        var thisClass = ((Object)(event.currentTarget)).className;
        $('.postit-list div.' + thisClass).css("visibility", "hidden");
    });
});
//# sourceMappingURL=PostitPaster.js.map
