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
        while (true) {
            var strCache = str;
            var s = str.replace(/\|=/g, "@@");
            if (s.match(/^(.*?[=][^=]*?[=]).*$/) == null) {
                //マッチしないとき
                result += str;
                break;
            }
            var s1 = s.replace(/^(.*?[=][^=]*?[=]).*$/, "$1");
            str = str.substr(s1.length, str.length - s1.length);

            //console.warn("str:" + str);
            var s2 = s1.replace(/^.*?[=]([^=]*)?[=].*$/, "$1");
            var s3 = s1.replace(/^(.*)?[=][^=]*?[=].*$/, "$1");
            result += s3 + '<span class="b">' + s2 + "</span>";
        }
        return result;
    };
    return BoldMarkup;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
