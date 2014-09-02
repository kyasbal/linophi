$(function () {
    $('.postit-list > img').draggable({
        helper: "clone"
    });

    $('.article-container > *').each(function (i) {
        var $ele = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');

        var className = $ele.attr("class");

        // alert(className);
        var height = $ele.outerHeight(), pos = $ele.offset().top;

        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className).css({
            "position": "absolute",
            "top": pos,
            "height": height,
            "width": "300px"
        }).droppable({
            accept: ".postit-list > img",
            hoverClass: "droppable-hover",
            drop: function (event, ui) {
                ui.draggable.clone().appendTo('.dropbox > .' + className);
            }
        });
    });
});
//# sourceMappingURL=PostitPaster.js.map
