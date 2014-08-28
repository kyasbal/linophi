var tagCounter = 0;
var tags = new collections.Set();

function removeTag(counter, tag) {
    console.warn("clicked");
    $('.edit-editted-tag-' + counter).remove();
    tags.remove(tag);
}
$(function () {
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
