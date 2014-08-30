var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
$(function () {
    var m = new BoldMarkup();
    m.getMarkupString("今日は=いい天気で=す。|=あいうえお|=。かきく|=けこ=");
});
var MarkupBase = (function () {
    function MarkupBase() {
    }
    MarkupBase.prototype.getMarkupString = function (str) {
        return "Not Implemented";
    };
    return MarkupBase;
})();

var BoldMarkup = (function (_super) {
    __extends(BoldMarkup, _super);
    function BoldMarkup() {
        _super.apply(this, arguments);
    }
    BoldMarkup.prototype.getMarkupString = function (str) {
        var result = "";
        result = str.replace(/\\\*/g, "\u0006\u0006");
        result = result.replace(/\*(.+?)\*/, "<span class=\"b\">$1</span>");
        result = result.replace(/\u0006\u0006/g, "*");
        return result;
    };
    return BoldMarkup;
})(MarkupBase);

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

var LinkMarkup = (function (_super) {
    __extends(LinkMarkup, _super);
    function LinkMarkup() {
        _super.apply(this, arguments);
    }
    LinkMarkup.prototype.getMarkupString = function (result) {
        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(.jpg|.jpeg|.gif|.png)$)/g, "<Img Src=\"$1\">");
        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(?!(.jpg|.jpeg|.gif|.png))$)/g, "<a href='$1'>$1</a>");
        return result;
    };
    return LinkMarkup;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
