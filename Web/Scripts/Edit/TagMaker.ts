﻿var tagCounter: number = 0;
var tags: collections.Set<string> = new collections.Set<string>();

function removeTag(counter, tag) {
    console.warn(tagCounter);
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
    tagCounter--;

    if (tagCounter <= 5) {
        $('.edit-tag-chkvalid').html("");
    }
}

module TagUtil {
    export interface GetTagCountDelegate {
        (count: number, callbackArg: any): void;
    }

    export function GetTagCount(tag: string, callbackArg: any, callback: GetTagCountDelegate) {
        $.ajax({
            url: "/api/Tag/GetTagCount",
            type: "post",
            data: { Tag: tag },
            success: (d) => {
                callback(d["TagCount"], callbackArg);
            }
           
        });
    }

    export function chkValidTitle(val: string) {
        isConfirmedTitle = true;
        val=val.replace(/\s/g, "");
        $(".edit-title-chkvalid").html("");
        //if (val.match(/.*\s{2,}.*/))
        //{
        //    $(".edit-title-chkvalid").html("　　空白は２つ以上繋げられません");
        //    isConfirmedTitle = false;
        //}
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

    export function chkValidTag(val: string) {
        isConfirmedTag = true;
        if (120 < val.length) {
            $('.edit-tag-chkvalid').html(
                '<div class="edit-alert">　　タグ名が長すぎます</div>'
                );
            isConfirmedTag = false;
        }
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        console.log("val:" + val, "len:" + val.length, "validate:" + validate, "isconfirmedtag:" + isConfirmedTag);
    }


    export function onGoodCondition(validate: boolean) {
        var bgColor = validate ? '#1e90ff' : '#ccc',
            bgColorHover = validate ? '#99ccff' : '#696969';

        $(".edit-submit-button").css('background-color', bgColor);
        $(".edit-submit-button").hover(function () {
            $(this).css("background-color", bgColorHover);
        }, function () {
            $(this).css("background-color", bgColor);
        });

        var bgColor2 = validate ? '#1e90ff' : '#ccc',
            bgColor2Hover = validate ? '#99ccff' : '#696969';

        $(".preview-button").css('background-color', bgColor2);
        $(".preview-button").hover(function () {
            $(this).css("background-color", bgColor2Hover);
        }, function () {
            $(this).css("background-color", bgColor2);
        });
    }

    export function addTag() {
        var $target: JQuery = $(".edit-tag");
        var tag: string = $target.val();

        tag = tag.replace(/　/g, " ");
        var tagArr = tag.split(" ");
        var conclusiveConfirmedTag = true;
        for (var i = 0, len = tagArr.length; i < len; i++) {
            if (tagArr[i] && !tags.contains(tagArr[i])) {
                $(".edit-editted-box").append(
                    '<div class="edit-editted-tag-' + tagCounter + '">' + tagArr[i] +
                    '<span class="edit-editted-tag-counter-' + tagCounter + '">(?)</span><span class="edit-editted-tag-delete-' + tagCounter +
                    '" onClick="removeTag(\'' + tagCounter + '\',\'' + tagArr[i] + '\')">x</span></div>'
                    );
                TagUtil.GetTagCount(tagArr[i], tagCounter, (count: number, tagCount: number) => {
                    $(".edit-editted-tag-counter-" + tagCount).text("(" + count + ")");
                });
                tags.add(tagArr[i]);
                tagCounter++;

                if (tagCounter > 5) {
                    conclusiveConfirmedTag = false;
                    $('.edit-tag-chkvalid').html(
                        '<div class="edit-alert">　　タグは５個までしか登録できません。タグの × を押して個数を減らしてください。</div>'
                    );
                }
            }
            tagArr.forEach((tagname) => {
                TagUtil.chkValidTag(tagname);
            });
        }
        isConfirmedTag = isConfirmedTag && conclusiveConfirmedTag;
        validate = isConfirmedTag && isConfirmedTitle;
        TagUtil.onGoodCondition(validate);
        $target.val("");
    }
}

$(() => {
    // タグをEnterで追加する機能
    $(".edit-tag").keypress((e) => {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            TagUtil.addTag();
        }
    });
    $(".edit-tag").focusout(() => {
        TagUtil.addTag();
    });


    if ($("#hidden-mode").val() == "edit") {  
        isConfirmedTitle = true;
        return;
    }


    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focus(() => {
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        TagUtil.chkValidTitle($(".edit-title").val());
    });
    $(".edit-title").keyup(() => {
        validate = isConfirmedTitle && isConfirmedTag;
        TagUtil.onGoodCondition(validate);
        TagUtil.chkValidTitle($(".edit-title").val());
    });
});