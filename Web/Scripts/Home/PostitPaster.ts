$(() =>
{
    /*
     * ふせんをクリックされたら左側に影的なものを出して周りを暗くする
     * 次のタイミングにクリックされたら貼り付ける
     * 貼り付けられた（クリック領域でクリックされたら）そこに貼る
     * それはこっちで用意した場所に追加されるが、すでに貼られていた場合は値を増やす。
     */
    

    $('.postit-list > img').click(() =>
    {
        $('.fade-layer').css({
            "visibility": "visible",
            "opacity": 0.5
        });
        console.log("called");
    });
});


/*
$(() =>
{
    $('.postit-list > img').draggable({
        helper: "clone"
    });

    $('.article-container > *').each((i) =>
    {
        var $ele: JQuery = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');

        var className = $ele.attr("class");

        // alert(className);

        var height: number = $ele.outerHeight(),
            pos: number = $ele.offset().top;


        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className)
            .css({
                "position": "absolute",
                "top": pos,
                "height": height,
                "width": "300px",
            })
            .droppable({
                accept: ".postit-list > img",
                hoverClass: "droppable-hover",
                drop: (event, ui) =>
                {
                    ui.draggable.clone().appendTo('.dropbox > .' + className);
                }
            });
    });
});
*/