var tagCounter: number = 0;
var tags: collections.Set<string> = new collections.Set<string>();

function removeTag(counter,tag)
{
    console.warn("clicked");
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
}
$(() => {

    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focusout(() => {
        $.ajax({
            type: 'post',
            url: '/Api/Article/IsValidTitle',
            data: {
                Title: $(".edit-title").val()
            },
            success: (data) => {
                $(".edit-title-chkvalid").html(data.IsOK ? "" : data.ErrorMessage);
            }
        });
    });
    

    // タグをEnterで追加する機能
    $(".edit-tag").keypress((e)=>{
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))
        {
            var $target = $(".edit-tag");
            var tag: string = $target.val();

            if (tag&&!tags.contains(tag)) {
                $(".edit-tag-container").append(
                    '<div class="edit-editted-tag-' + tagCounter + '">' + tag +
                    '<span class="edit-tag-delete-' + tagCounter +
                    '" onClick="removeTag(\''+tagCounter+'\',\''+tag+'\')">x</span></div>'
                );
                tags.add(tag);
                tagCounter++;
            }

            $target.val("");
        }
    });
});