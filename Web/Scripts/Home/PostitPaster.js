$(function () {
    var htmlHeight = $('.foot').offset().top + $('.foot').outerHeight();

    $('html').css({
        "height": htmlHeight + "px"
    });

    /*
    * ふせんをクリックされたら左側に影的なものを出して周りを暗くする
    * 次のタイミングにクリックされたら貼り付ける
    * 貼り付けられた（クリック領域でクリックされたら）そこに貼る
    * それはこっちで用意した場所に追加されるが、すでに貼られていた場合は値を増やす。
    */
    var pasteMode = false;

    var $fadeLayer = $('.fade-layer');

    var src;
    var dropboxPos = $('.contentswrapper').offset().top, dropboxHeight = $('.contentswrapper').outerHeight();

    var posX = $('.dropbox').offset().left + 20, posY = dropboxPos + 10;

    $('.article-container > *').each(function (i) {
        var $ele = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');

        var className = $ele.attr("class");

        // alert(className);
        var eleHeight = $ele.outerHeight(), elePos = $ele.offset().top;

        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className).css({
            "position": "absolute",
            "top": elePos + "px",
            "height": eleHeight + "px",
            "width": "300px"
        });
    });

    $('.postit-list > img').click(function (event) {
        pasteMode = true;

        $fadeLayer.css({
            "visibility": "visible",
            "opacity": 0.5
        });

        src = event.currentTarget.src; // なぜかVSで赤線がでるけどちゃんと動きます
        $fadeLayer.html('<img src="' + src + '">');

        $fadeLayer.mousemove(function (e) {
            if (dropboxPos <= e.pageY && e.pageY <= dropboxPos + dropboxHeight) {
                posY = e.pageY - 20;
            }
            $('.fade-layer > img').css({
                "position": "absolute",
                "top": posY + "px",
                "left": posX + "px"
            });

            var pHeights = dropboxPos;

            $('.dropbox > [class^="x_p-"]').each(function (i) {
                var $target = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ')');
                var pHeight = $target.outerHeight();
                var bg = "none";
                if (pHeights <= posY && posY <= pHeights + pHeight && pasteMode) {
                    bg = "#fcc";
                }

                $target.css({
                    "background": bg
                });

                pHeights += pHeight;
                //console.log($target.attr("class"), pHeight, pHeights, posY, src);
            });
        });

        console.log("called");
    });

    $fadeLayer.click(function () {
        pasteMode = false;

        $fadeLayer.css("opacity", 0);
        setTimeout(function () {
            $fadeLayer.css("visibility", "hidden");
        }, 500);

        var pHeights = dropboxPos;

        $('.dropbox > [class^="x_p-"]').each(function (i) {
            var $target = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ')');
            var pHeight = $target.outerHeight();
            if (pHeights <= posY && posY <= pHeights + pHeight) {
                $target.append('<img src="' + src + '">');
            }

            pHeights += pHeight;

            console.log($target.attr("class"), pHeight, pHeights, posY, src);
        });
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
//# sourceMappingURL=PostitPaster.js.map
