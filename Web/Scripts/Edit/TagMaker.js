var tagCounter = 0;
var tags = new collections.Set();

function removeTag(counter, tag) {
    console.warn(tagCounter);
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
    tagCounter--;

    if (tagCounter <= 5) {
        $('.edit-tag-chkvalid').html("");
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
        isConfirmedTitle = true;
        $(".edit-title-chkvalid").html("");
        if (val.match(/^\s*$/)) {
            $(".edit-title-chkvalid").html("　　タイトルが空です");
            isConfirmedTitle = false;
        } else if (val.length < 5) {
            $(".edit-title-chkvalid").html("　　タイトルが短すぎます");
            isConfirmedTitle = false;
        } else if (120 < val.length) {
            $(".edit-title-chkvalid").html("　　タイトルが長すぎます");
            isConfirmedTitle = false;
        }
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
    }
    TagUtil.chkValidTitle = chkValidTitle;

    function chkValidTag(val) {
        isConfirmedTag = true;
        if (120 < val.length) {
            $('.edit-tag-chkvalid').html('<div class="edit-alert">　　タグ名が長すぎます</div>');
            isConfirmedTag = false;
        }
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        console.log("val:" + val, "len:" + val.length, "validate:" + validate, "isconfirmedtag:" + isConfirmedTag);
    }
    TagUtil.chkValidTag = chkValidTag;

    function onGoodCondition(validate) {
        var bgColor = validate ? '#7FFFD4' : '#696969', bgColorHover = validate ? '#3CB371' : '#696969';

        $(".edit-submit-button").css('background-color', bgColor);
        $(".edit-submit-button").hover(function () {
            $(this).css("background-color", bgColorHover);
        }, function () {
            $(this).css("background-color", bgColor);
        });
    }
    TagUtil.onGoodCondition = onGoodCondition;

    function addTag() {
        var $target = $(".edit-tag");
        var tag = $target.val();

        tag = tag.replace(/　/g, " ");
        var tagArr = tag.split(" ");
        var conclusiveConfirmedTag = true;
        for (var i = 0, len = tagArr.length; i < len; i++) {
            if (tagArr[i] && !tags.contains(tagArr[i])) {
                $(".edit-editted-box").append('<div class="edit-editted-tag-' + tagCounter + '">' + tagArr[i] + '<span class="edit-editted-tag-counter-' + tagCounter + '">(?)</span><span class="edit-editted-tag-delete-' + tagCounter + '" onClick="removeTag(\'' + tagCounter + '\',\'' + tagArr[i] + '\')">x</span></div>');
                TagUtil.GetTagCount(tagArr[i], tagCounter, function (count, tagCount) {
                    $(".edit-editted-tag-counter-" + tagCount).text("(" + count + ")");
                });
                tags.add(tagArr[i]);
                tagCounter++;

                if (tagCounter > 5) {
                    conclusiveConfirmedTag = false;
                    $('.edit-tag-chkvalid').html('<div class="edit-alert">　　タグは５個までしか登録できません。タグの × を押して個数を減らしてください。</div>');
                }
            }
            tagArr.forEach(function (tagname) {
                TagUtil.chkValidTag(tagname);
            });
        }
        isConfirmedTag = isConfirmedTag && conclusiveConfirmedTag;
        TagUtil.onGoodCondition(isConfirmedTag);
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

    if ($("#hidden-mode").val() == "edit") {
        isConfirmedTitle = true;
        return;
    }

    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focus(function () {
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        TagUtil.chkValidTitle($(".edit-title").val());
    });
    $(".edit-title").keyup(function () {
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        TagUtil.chkValidTitle($(".edit-title").val());
    });
});
//# sourceMappingURL=TagMaker.js.map
