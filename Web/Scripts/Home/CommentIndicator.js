var CommentSourceParser = (function () {
    function CommentSourceParser() {
        this.commentJson = JSON.parse($("#comment-info").text());
    }
    CommentSourceParser.prototype.eachDoInComments = function (paragraphId, handler) {
        for (var k = 0, len = this.commentJson.length; k < len; k++) {
            if (this.commentJson[k]["ParagraphId"] == paragraphId) {
                handler(this.commentJson[k]["Name"], this.commentJson[k]["PostTime"], this.commentJson[k]["AutoId"], this.commentJson[k]["Comment"]);
            }
        }
    };
    return CommentSourceParser;
})();

function logSelector(selector) {
    var $elemSelector = $(selector);
    console.log("selector:" + selector + "\nlength" + $elemSelector.length);
    return $elemSelector;
}

$(function () {
    var commentSourceParser = new CommentSourceParser();

    // コメントの表示に関する
    $('.article-container > *').each(function (i) {
        var $ele = $('[class^="x_p"]:nth-child(' + (i + 1) + ')');
        var className = $ele.attr("class");
        if (className) {
            var splitted = className.split(" ");
            var isMatched = false;
            for (var j = 0; j < splitted.length; j++) {
                if (splitted[j].match(/x_[pd]-[a-zA-Z0-9]{10}$/)) {
                    isMatched = true;
                    className = splitted[j];
                    break;
                }
            }
            if (isMatched && className) {
                $('.article-container .' + className).append('<div class="' + className + '-comments"></div>');

                commentSourceParser.eachDoInComments(getParagraphId(className), function (name, time, id, comment) {
                    console.log(name, time, id, comment);
                    $('.article-container .' + className + '-comments').append('<div class="response">' + '<p class="res-title"> <span></span> <b>' + name + '</b> <small>[' + time + '] ID:' + id + ' </small> </p>' + '<p class="res-text">' + comment + '</p>' + '</div>');
                });
                $('.article-container .' + className + '-comments .res-title > span').each(function (j) {
                    $('.' + className + '-comments .response:nth-child(' + (j + 1) + ') span').html((j + 1) + "");
                });

                console.log(logSelector('.article-container .' + className + '-comments'));
                $('.article-container .' + className + '-comments').append('<button class="' + className + '">コメントする</button>');
            }
        }
    });

    $('.widget button').on("click", function (e) {
        var formHtml = '<input type="text" name="name" value="" placeholder="Name" />' + '<textarea name="message" placeholder="Messages"></textarea>';

        $().alertwindow(formHtml, "送信", "コメントする", function () {
            var $form = $('.alert-box');
            if ($(".alert-box textarea").val()) {
                var $button = $form.find('button');
                console.info(location.pathname.substr(1), $form.find("input").val(), getParagraphId((Object)(e.currentTarget).className), $form.find("textarea").val());
                $.ajax({
                    url: "/api/Comment/AttachComment",
                    type: "post",
                    data: {
                        "ArticleId": location.pathname.substr(1),
                        "UserName": s($form.find("input").val()) || "no name",
                        "ParagraphId": getParagraphId((Object)(e.currentTarget).className),
                        "Comment": s($form.find("textarea").val()) || "no message"
                    },
                    timeout: 10000,
                    beforeSend: function () {
                        $button.attr('disabled', 'true');
                    },
                    complete: function () {
                        $button.attr('disabled', 'false');
                    },
                    success: function () {
                        $form.find("input, textarea").val("");
                    },
                    error: function () {
                        alert("送信失敗しました");
                    }
                });
            } else {
                alert("空欄を埋めてください");
            }
        });
    });
});
//# sourceMappingURL=CommentIndicator.js.map
