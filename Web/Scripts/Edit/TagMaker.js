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

    function chkValidTitle(val) {
        var isConfirmedTitle = true;
        $(".edit-title-chkvalid").html("");
        if (val.match(/^\s*$/)) {
            $(".edit-title-chkvalid").html("　　タイトルが空です");
            isConfirmedTitle = false;
        } else if (val.length < 5) {
            $(".edit-title-chkvalid").html("　　タイトルが短すぎます");
            isConfirmedTitle = false;
        } else if (50 <= val.length) {
            $(".edit-title-chkvalid").html("　　タイトルが長すぎます");
            isConfirmedTitle = false;
        }

        var bgColor = isConfirmedTitle ? '#7FFFD4' : '#696969', bgColorHover = isConfirmedTitle ? '#3CB371' : '#696969';

        $(".edit-submit-button").css('background-color', bgColor);
        $(".edit-submit-button").hover(function () {
            $(this).css("background-color", bgColorHover);
        }, function () {
            $(this).css("background-color", bgColor);
        });
    }
    TagUtil.chkValidTitle = chkValidTitle;

    function addTag() {
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
    TagUtil.addTag = addTag;
})(TagUtil || (TagUtil = {}));
$(function () {
    // タグをEnterで追加する機能
    $(".edit-tag").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            TagUtil.addTag();
        }
    });
    $(".edit-tag").focusout(function () {
        TagUtil.addTag();
    });

    //if ($("#hidden-mode").val() == "edit") {  <-何やってるかわからんかった
    //    isConfirmedTitle = true;
    //    return;
    //}
    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focus(function () {
        TagUtil.chkValidTitle($(".edit-title").val());
    });
    $(".edit-title").keyup(function () {
        TagUtil.chkValidTitle($(".edit-title").val());
    });
});
//# sourceMappingURL=TagMaker.js.map
