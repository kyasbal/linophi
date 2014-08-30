$(() =>
{
    $('.article-container [class^="p-"]').each((i) =>
    {
        var $ele = $('.article-container .p-' + i);

        var height = $ele.outerHeight(),
            pos = $ele.offset().top;

        $('.dropbox').append('<div class="p-' + i + '"></div>');

        $('.postit-list > img').draggable({
            helper: "clone"
        });

        $('.dropbox > .p-' + i)
            .css({
                "position": "absolute",
                "top": pos,
                "height": height,
                "width": "300px",
                // "background": "#87ceeb"
            })
            .droppable({
                accept: ".postit-list > img",
                hoverClass: "droppable-hover",
                drop: (event, ui) =>
                {
                    ui.draggable.clone().appendTo('.dropbox > .p-' + i);
                }
            });
    });
});