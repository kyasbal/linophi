var tagCounter: number = 0;
var tags: collections.Set<string> = new collections.Set<string>();

function removeTag(counter,tag)
{
    console.warn(tagCounter);
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
    tagCounter--;

    if (tagCounter <= 5)
    {
        $('.edit-tag-chkvalid').html("");
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

    export function chkValidTitle(val: string)
    {
        var isConfirmedTitle = true;
        $(".edit-title-chkvalid").html("");
        if (val.match(/^\s*$/)) {
            $(".edit-title-chkvalid").html("　　タイトルが空です");
            isConfirmedTitle = false;
        } else if (val.length < 5) {
            $(".edit-title-chkvalid").html("　　タイトルが短すぎます");
            isConfirmedTitle = false;
        } else if (50 <= val.length) { // どういう条件だったっけ？
            $(".edit-title-chkvalid").html("　　タイトルが長すぎます");
            isConfirmedTitle = false;
        }

        var bgColor = isConfirmedTitle ? '#7FFFD4' : '#696969',
            bgColorHover = isConfirmedTitle ? '#3CB371' : '#696969';

        $(".edit-submit-button").css('background-color', bgColor);
        $(".edit-submit-button").hover(function () {
            $(this).css("background-color", bgColorHover);
        }, function () {
            $(this).css("background-color", bgColor);
        });
    }

    export function addTag()
    {
        var $target: JQuery = $(".edit-tag");
        var tag: string = $target.val();

        tag = tag.replace(/　/g, " ");
        var tagArr = tag.split(" ");

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
                    $('.edit-tag-chkvalid').html(
                        '<div class="edit-alert">　　タグは５個までしか登録できません。タグの × を押して個数を減らしてください。</div>'
                    );
                }
            }
        }

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


    //if ($("#hidden-mode").val() == "edit") {  <-何やってるかわからんかった
    //    isConfirmedTitle = true;
    //    return;
    //}


    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focus(() => {
        TagUtil.chkValidTitle($(".edit-title").val());
    });
    $(".edit-title").keyup(() => {
        TagUtil.chkValidTitle($(".edit-title").val());
    });
});