var tagCounter = 0;
var tags = new collections.Set();

function removeTag(counter, tag) {
    console.warn(tagCounter);
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
    tagCounter--;

    if (tagCounter < 5) {
        $(".edit-tag-chkvalid").html("");
    }
}

var TagUtil;
(function (TagUtil) {
    function GetTagCount(tag, callbackArg, callback) {
        $.ajax({
            url: "/api/Tag/GetTagCount",
            type: "post",
            data: { Tag: tag },
            success: function (d) {
                callback(d["TagCount"], callbackArg);
            }
        });
    }
    TagUtil.GetTagCount = GetTagCount;
})(TagUtil || (TagUtil = {}));
$(function () {
    // タグをEnterで追加する機能
    $(".edit-tag").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var $target = $(".edit-tag");
            var tag = $target.val();

            if (tagCounter >= 5) {
                $(".edit-tag-chkvalid").html('<div class="edit-alert">　　タグは５個までしか登録できません。</div>');
            } else if (tag && !tags.contains(tag)) {
                $(".edit-editted-box").append('<div class="edit-editted-tag-' + tagCounter + '">' + tag + '<span class="edit-editted-tag-counter-' + tagCounter + '">(?)</span><span class="edit-editted-tag-delete-' + tagCounter + '" onClick="removeTag(\'' + tagCounter + '\',\'' + tag + '\')">x</span></div>');
                TagUtil.GetTagCount(tag, tagCounter, function (count, tagCount) {
                    $(".edit-editted-tag-counter-" + tagCount).text("(" + count + ")");
                });
                tags.add(tag);
                tagCounter++;
            }

            $target.val("");
        }
    });
    if ($("#hidden-mode").val() == "edit") {
        isConfirmedTitle = true;
        return;
    }

    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focusout(function () {
        $.ajax({
            type: 'post',
            url: '/Api/Article/IsValidTitle',
            data: {
                Title: $(".edit-title").val()
            },
            success: function (data) {
                $(".edit-title-chkvalid").html(data.IsOK ? "" : "　　" + data.ErrorMessage);
                isConfirmedTitle = data.IsOK;
                if (isConfirmedTitle == false) {
                    $(".edit-submit-button").css('background-color', '#696969');
                    $(".edit-submit-button").hover(function () {
                        $(this).css("background-color", "#696969");
                    }, function () {
                        $(this).css("background-color", "#696969");
                    });
                }
                if (isConfirmedTitle == true) {
                    $(".edit-submit-button").css('background-color', '#7FFFD4');
                    $(".edit-submit-button").hover(function () {
                        $(this).css("background-color", "#3CB371");
                    }, function () {
                        $(this).css("background-color", "#7FFFD4");
                    });
                }
            }
        });
    });
});
//# sourceMappingURL=TagMaker.js.map
