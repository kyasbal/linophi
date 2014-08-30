var tagCounter = 0;
var tags = new collections.Set();

function removeTag(counter, tag) {
    console.warn("clicked");
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
}
$(function () {
    // タイトルが正当かどうかを判定してダメならエラーを返す機能
    $(".edit-title").focusout(function () {
        $.ajax({
            type: 'post',
            url: '/Api/Article/IsValidTitle',
            data: {
                Title: $(".edit-title").val()
            },
            success: function (data) {
                $(".edit-title-chkvalid").html(data.IsOK ? "" : data.ErrorMessage);
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

    // タグをEnterで追加する機能
    $(".edit-tag").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var $target = $(".edit-tag");
            var tag = $target.val();

            if (tag && !tags.contains(tag)) {
                $(".edit-tag-container").append('<div class="edit-editted-tag-' + tagCounter + '">' + tag + '<span class="edit-tag-delete-' + tagCounter + '" onClick="removeTag(\'' + tagCounter + '\',\'' + tag + '\')">x</span></div>');
                tags.add(tag);
                tagCounter++;
            }

            $target.val("");
        }
    });
});
//# sourceMappingURL=TagMaker.js.map
