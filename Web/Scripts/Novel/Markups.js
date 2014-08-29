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
        result = result.replace(/"(.+?)"/, "<blockquote>$1</blockquote>");
        result = result.replace(/\u0006\u0006/g, "\"");
        return result;
    };
    return QuoteMarkup;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
