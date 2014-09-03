$(() =>
{

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

    var pasteMode: boolean = false;

    var $fadeLayer: JQuery = $('.fade-layer');

    var src: string;
    var dropboxPos: number = $('.contentswrapper').offset().top,
        dropboxHeight: number = $('.contentswrapper').outerHeight();

    var posY: number = dropboxPos + 10;

    $('.article-container > *').each((i) => {
        var $ele: JQuery = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');

        var className = $ele.attr("class");

        // alert(className);

        var eleHeight: number = $ele.outerHeight(),
            elePos: number = $ele.offset().top;


        $('.dropbox').append('<div class="' + className + '"></div>');

        $('.dropbox > .' + className).css({
            "position": "absolute",
            "top": elePos - dropboxPos + "px",
            "height": eleHeight + "px",
            "width": "300px",
        });
    });



    // 貼り付けモードへ
    $('.postit-list > img').click((event) =>
    {
        pasteMode = true;

        $fadeLayer.css({
            "visibility": "visible",
            "opacity": 1
        });

        src = event.currentTarget.src; // なぜかVSで赤線がでるけどちゃんと動きます
        // $fadeLayer.html('<img src="' + src + '">');

        $('.fade-layer, .dropbox').mousemove((e) =>
        {
            if (dropboxPos <= e.pageY && e.pageY <= dropboxPos + dropboxHeight)
            {
                posY = e.pageY - 20;
            }

            if (pasteMode)
            {
                $('.dropbox').css({
                    "opacity": 0.7, 
                    "z-index": 1100
                });
                $(".dropbox > .postit-pasting").css({
                    "position": "absolute",
                    "top": posY - dropboxPos + "px",
                    "left": "20px",
                    "z-index": 1100,
                    "visibility": "visible",
                    "background-image": "url(" + src + ")",
                    "background-size": "130px 43px"
                });
            }
            var pHeights: number = dropboxPos;

            $('.dropbox > [class^="x_p-"]').each((i) => {
                var $target: JQuery = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ')');
                var pHeight: number = $target.outerHeight();
                var bg = "none";
                if (pHeights <= posY && posY <= pHeights + pHeight && pasteMode)
                {
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


    // 貼り付けて戻る
    $('.dropbox').click(() =>
    {
        $fadeLayer.css("opacity", 0);
        setTimeout(() => {
            $fadeLayer.css("visibility", "hidden");
        }, 500);

        $('.dropbox').css("opacity", 1);
        setTimeout(() =>
        {
            $('.dropbox').css("z-index", 0);
        }, 500);

        $('.dropbox > .postit-pasting').css({
            "z-index": -100,
            "visibility": "hidden"
        });

        if (pasteMode)
        {
            var pHeights: number = dropboxPos;

            $('.dropbox > [class^="x_p-"]').each((i) =>
            {
                var $target: JQuery = $('.dropbox > [class^="x_p-"]:nth-child(' + (i + 1) + ')');
                var pHeight: number = $target.outerHeight();

                var counter: number = $('[src="' + src + '"]').length;

                if (pHeights <= posY && posY <= pHeights + pHeight)
                {
                    // $target.append('<img src="' + src + '">');
                    $target.append(
                        '<div style="background-image:url(' + src + ');background-size:130px 43px;height:43px;width:130px;"></div>'
                    );
                }

                pHeights += pHeight;

                console.log($target.attr("class"), pHeight, pHeights, posY, src);
            });

            pasteMode = false;
        }
    });

});