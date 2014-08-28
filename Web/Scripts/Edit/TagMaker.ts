var tagCounter: number = 0;

function remove(target: string)
{
    
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
    $(".edit-tag").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var tag: string = $(this).val();

            if (tag) {
                $(".edit-tag-container").append(
                    '<div class="edit-editted-tag-' + tagCounter + '">' + tag +
                    '<span class="edit-tag-delete-' + tagCounter +
                    '" onClick="$(\'.edit-editted-tag-' + tagCounter + '\').hide();">x</span></div>'
                );
            }

            $(this).val("");

            tagCounter++;
        }
    });
});