var tagCounter: number = 0;

function remove(target: string)
{
    
}
$(() => {
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