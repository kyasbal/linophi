$(function () {
    $('.article-container [class^="p-"]').each(function (i) {
        var $ele = $('.article-container .p-' + i);

        var height = $ele.outerHeight(), pos = $ele.offset().top;

        $('.dropbox').append('<div class="p-' + i + '"></div>');

        $('.postit-list > img').draggable({
            helper: "clone"
        });

        $('.dropbox > .p-' + i).css({
            "position": "absolute",
            "top": pos,
            "height": height,
            "width": "300px"
        }).droppable({
            accept: ".postit-list > img",
            hoverClass: "droppable-hover",
            drop: function (event, ui) {
                ui.draggable.clone().appendTo('.dropbox > .p-' + i);
            }
        });
    });
});
//# sourceMappingURL=PostitPaster.js.map
