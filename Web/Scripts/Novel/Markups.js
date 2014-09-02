var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MarkupBase = (function () {
    function MarkupBase() {
    }
    MarkupBase.prototype.getMarkupString = function (str) {
        return null;
    };
    return MarkupBase;
})();

var QuoteMarkup = (function (_super) {
    __extends(QuoteMarkup, _super);
    function QuoteMarkup() {
        _super.apply(this, arguments);
    }
    QuoteMarkup.prototype.getMarkupString = function (str) {
        var result = "";
        result = str.replace(/\\"/g, "\u0006\u0006");
        if (result.match(/"(.+?)(\{.*?\})"/)) {
            result = result.replace(/"(.+?)\{(.*?)\}"/, "<blockquote><div class=\"quote\"><p class=\"quote-body\">$1</p></br><p class=\"source\">出典:$2</p></div></blockquote>");
        } else {
            result = result.replace(/"(.+?)"/, "<blockquote><p class=\"quote\">$1</p></blockquote>");
        }
        result = result.replace(/\u0006\u0006/g, "\"");
        return result;
    };
    return QuoteMarkup;
})(MarkupBase);

var BoldMarkup = (function (_super) {
    __extends(BoldMarkup, _super);
    function BoldMarkup() {
        _super.apply(this, arguments);
    }
    BoldMarkup.prototype.getMarkupString = function (str) {
        var result = str;
        var rep;

        result = result.replace(/^\*(.*?[^\\])\*/, "<span class=\"b\">$1</span>");
        while (true) {
            rep = result.replace(/([^\\])\*(.*?[^\\])\*/, "$1<span class=\"b\">$2</span>");
            if (rep == result)
                break;
            result = rep;
        }

        return result.replace(/\\\*/, "*");
    };
    return BoldMarkup;
})(MarkupBase);

var LinkMarkup = (function (_super) {
    __extends(LinkMarkup, _super);
    function LinkMarkup() {
        _super.apply(this, arguments);
    }
    LinkMarkup.prototype.getMarkupString = function (result) {
        console.warn("link");
        result = result.replace(/&ensp;/g, "\u0006");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-_]+(\.jpg|\.jpeg|\.gif|\.png))/g, "<Img Src=\"$1\">");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-_]+)([^\w\/:%#\$&\?\(\)~\.=\+\-])(?!>)/g, "<a href='$1'>$1</a>$2");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-_]+)$/, "<a href='$1'>$1</a>");
        return result.replace(/\u0006/g, "&ensp;");
    };
    return LinkMarkup;
})(MarkupBase);

var YoutubeMarkup = (function (_super) {
    __extends(YoutubeMarkup, _super);
    function YoutubeMarkup() {
        _super.apply(this, arguments);
    }
    YoutubeMarkup.prototype.getMarkupString = function (result) {
        result = result.replace(/https:\/\/www\.youtube\.com\/watch\?v=([\w]+)/, "<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/$1\" frameborder=\"0\" allowfullscreen></iframe>");
        return result;
    };
    return YoutubeMarkup;
})(MarkupBase);
var NikonikoMarkup = (function (_super) {
    __extends(NikonikoMarkup, _super);
    function NikonikoMarkup() {
        _super.apply(this, arguments);
    }
    NikonikoMarkup.prototype.getMarkupString = function (result) {
        result = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "<script type = \"text\/javascript\"src=\"http://ext.nicovideo.jp/thumb_watch/$1?w=490&h=307\" ></script><noscript><a href=\"http://www.nicovideo.jp/watch/$1\">同がリンク</a></noscript>");
        return result;
    };
    return NikonikoMarkup;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
