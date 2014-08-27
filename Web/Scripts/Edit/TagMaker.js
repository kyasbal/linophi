$(function () {
    $(".edit-tag").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var tag = $(this).val() || "";
            $(".edit-tag-container").append('<div class="edit-editted-tag">' + tag + '</div>');
            $(this).val("");
        }
    });
});
//# sourceMappingURL=TagMaker.js.map
