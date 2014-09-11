﻿var tagCounter: number = 0;
var tags: collections.Set<string> = new collections.Set<string>();

var focusTitle: boolean;

function removeTag(counter,tag)
{
    console.warn(tagCounter);
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
    tagCounter--;

    if (tagCounter < 5)
    {
        $(".edit-tag-chkvalid").html("");
    }
}

module TagUtil
{
    export interface GetTagCountDelegate
    {
        (count:number,callbackArg:any):void;
    }
    export function GetTagCount(tag:string,callbackArg:any,callback:GetTagCountDelegate)
    {
        $.ajax({
            url: "/api/Tag/GetTagCount",
            type: "post",
            data: { Tag: tag },
            success: (d) =>
            {
                callback(d["TagCount"],callbackArg);
            }
           
        });
    }

    export function chkValidTitle()
    {
        $.ajax({
            type: 'post',
            url: '/Api/Article/IsValidTitle',
            data: {
                Title: $(".edit-title").val()
            },
            success: (data) => {
                $(".edit-title-chkvalid").html(data.IsOK ? "" : "　　" + data.ErrorMessage);
                isConfirmedTitle = data.IsOK;

                var bgColor = isConfirmedTitle ? '#7FFFD4' : '#696969',
                    bgColorHover = isConfirmedTitle ? '#3CB371' : '#696969';

                $(".edit-submit-button").css('background-color', bgColor);
                $(".edit-submit-button").hover(function () {
                    $(this).css("background-color", bgColorHover);
                }, function () {
                    $(this).css("background-color", bgColor);
                });
            },
            complete: () => {
                if (focusTitle) {
                    setTimeout(() => {
                        this.chkValidTitle();
                        console.log("called");
                    }, 500);
                }
            }
        });

    }
}
$(() => {
    // タグをEnterで追加する機能
    $(".edit-tag").keypress((e) => {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var $target: JQuery = $(".edit-tag");
            var tag: string = $target.val();

            if (tagCounter >= 5) {
                $(".edit-tag-chkvalid").html(
                    '<div class="edit-alert">　　タグは５個までしか登録できません。</div>'
                );
            }
            else if (tag && !tags.contains(tag)) {
                $(".edit-editted-box").append(
                    '<div class="edit-editted-tag-' + tagCounter + '">' + tag +
                    '<span class="edit-editted-tag-counter-'+tagCounter+'">(?)</span><span class="edit-editted-tag-delete-' + tagCounter +
                    '" onClick="removeTag(\'' + tagCounter + '\',\'' + tag + '\')">x</span></div>'
                    );
                TagUtil.GetTagCount(tag, tagCounter, (count: number, tagCount: number) =>
                {
                    $(".edit-editted-tag-counter-" + tagCount).text("("+count+")");
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

    $(".edit-title").focus(() => {
        focusTitle = true;
        TagUtil.chkValidTitle();
    });
    $(".edit-title").focusout(() => {
        focusTitle = false;
    });
});