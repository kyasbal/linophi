'use strict';

$(() =>
{
    var commentJson = JSON.parse($("#comment-info").text());

    $('.article-container > *').each((i) =>
    {
        var $ele: JQuery = $('[class^="x_p-"]:nth-child(' + (i + 1) + ')');
        var className: string = $ele.attr("class");

        for (var j: number = 0, len: number = commentJson.length; j < len; j++)
        {
            
        }

        $('.widget .' + className).append('<div class="' + className + '-tooltip">76　　　雅　[2014/06/15(日) 19:31:34]<br />個人的には大学かもだけどぶっちゃけどっちも <br / >おもんないｗｗｗｗ <br / >77　　　さち　[2014 / 07 / 10(木) 01:03:45]<br />高校生の頃に戻りたい。 <br />まぢピーターパン症候群。 <br / >大学って楽しいトコだと <br / >思ってたけど <br />大きい大学行かなかった私は負け組。 <br />あ、行かなかったんじゃない。 <br />いけなかったんだ。<br / >78　　　あゆ　[2014 / 08 / 20(水) 11:28:41]<br />断然、高校の方が良かった <br / >79　　　りん　[2014 / 09 / 02(火) 10:02:50]<br />断然、高校！大学の友達は常識ないのばかりだし、性格も悪い。高校に戻りたい。</div>');
    });
});