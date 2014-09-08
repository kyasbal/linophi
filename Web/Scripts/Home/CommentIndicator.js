var CommentSourceParser = (function () {
    function CommentSourceParser() {
        this.commentJson = JSON.parse($("#comment-info").text());
    }
    CommentSourceParser.prototype.eachDoInComments = function (paragraphId, handler) {
        for (var i = 0, len = this.commentJson.length; i < len; i++) {
            if (this.commentJson[i]["ParagraphId"] == paragraphId) {
                handler(this.commentJson[i]["Name"], this.commentJson[i]["PostTime"], this.commentJson[i]["AutoId"], this.commentJson[i]["Comment"]);
            }
        }
    };
    return CommentSourceParser;
})();

$(function () {
    var commentSourceParser = new CommentSourceParser();

    // コメントの表示に関する
    $('.article-container > *').each(function (i) {
        var $ele = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');
        var className = $ele.attr("class");

        $('.widget .' + className).append('<div class="' + className + '-comments"></div>');

        commentSourceParser.eachDoInComments(className.substr(4), function (name, time, id, comment) {
            $('.widget .' + className + '-comments').append('<div class="response">' + '<p class="res-title"> counter <b>' + name + '</b> <small>[' + time + '] ID:' + id + ' </small> </p>' + '<p class="res-text">' + comment + '</p>' + '</div>');
        });
        $('.widget .' + className + '-comments').append('<button class="' + className + '">コメントする</button>');
    });

    $('.widget button').on("click", function (e) {
        var formHtml = '<form id="the-form">' + '<input type="text" name="name" value="" placeholder="Name" />' + '<textarea name="message" placeholder="Messages"></textarea>' + '<button>送信</button>' + '</form>';

        $().alertwindow(formHtml, "none", "コメントする", function () {
            $('#the-form').submit(function (event) {
                event.preventDefault();
                var $form = $(this);
                var $button = $form.find('button');
                console.info(location.pathname.substr(1), $form.find("input").val(), ((Object)(e.currentTarget)).className.substr(4), $form.find("textarea").val());
                $.ajax({
                    url: "/api/Comment/AttachComment",
                    type: "post",
                    data: {
                        "ArticleId": location.pathname.substr(1),
                        "UserName": $form.find("input").val(),
                        "ParagraphId": ((Object)(e.currentTarget)).className.substr(4),
                        "Comment": $form.find("textarea").val()
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
            });
        });
    });
});
//# sourceMappingURL=CommentIndicator.js.map
