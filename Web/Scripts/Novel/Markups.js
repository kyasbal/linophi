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

var RubyMarkupBase = (function (_super) {
    __extends(RubyMarkupBase, _super);
    function RubyMarkupBase() {
        _super.apply(this, arguments);
    }
    RubyMarkupBase.prototype.getMarkupString = function (str) {
        return RubyMarkupBase.toRubyExpression(str);
    };

    RubyMarkupBase.toRubyExpression = function (str) {
        var result = "";
        while (true) {
            var strCache = str;
            var s = str.replace(/\|[\(\)]/g, "@@");
            var s2 = s.replace(/^(.*?[\(].+?[\)]).*$/, "$1");
            var s3_a = s2.replace(/^(.*)?[\(].+?[\)]$/, "$1");
            s3_a = str.substr(0, s3_a.length);
            str = str.substr(s2.length, str.length - s2.length);
            if (str.length == 0 && s.match(/^(.+?[\(].+?[\)])$/) == null) {
                result += strCache.substr(0, s2.length).replace(/\|\(/g, "(");
                break;
            }
            console.warn("str:" + str);
            s3_a = s3_a.replace(/\|\(/g, "(").replace(/\|\)/g, ")");
            ;
            var s3_b = s2.replace(/^.*?[\(](.+)?[\)]$/, "$1");
            var cachedS2 = strCache.substr(0, s2.length);
            var l = s3_b.length;
            s3_b = cachedS2.substr(s3_a.length + 1, l).replace(/\|\(/g, "(").replace(/\|\)/g, ")");
            ;
            console.info("s2=" + s2);
            console.info("s3-a=" + s3_a);
            console.info("s3-b=" + s3_b);
            var c1 = s3_a.charAt(s3_a.length - 1);
            console.info("c1=" + c1);
            if (c1 == "*" && RubyMarkupBase.isHandRegion(s3_a)) {
                var s6 = s3_a.replace(/^.*\*([^\*]+)\*$/, "$1");
                console.warn("s6:" + s6);
                var s6_inv = s3_a.substr(0, s3_a.length - s6.length - 2);
                console.warn("inv_s6:" + s6_inv);
                result += s6_inv + "<ruby><rb>" + s6 + "</rb><rt>" + s3_b + "</rt></ruby>";
                continue;
            }

            if (RubyMarkupBase.isKanji(c1, 0)) {
                console.info("漢字/自動ルピ");
                var count = 1;
                while (true) {
                    if (s3_a.length - count == -1 || !RubyMarkupBase.isKanji(s3_a.charAt(s3_a.length - count), 0)) {
                        count--;
                        break;
                    }
                    count++;
                }
                var s4 = s3_a.substr(s3_a.length - count, count);
                console.warn("count:" + count);
                console.warn(s4);
                var s4_inv = s3_a.substr(0, s3_a.length - count);
                console.warn(s4_inv);
                result += s4_inv + "<ruby><rb>" + s4 + "</rb><rt>" + s3_b + "</rt></ruby>";
            } else if (RubyMarkupBase.isAlphabet(c1)) {
                console.info("アルファベット/自動ルピ");
                var s5 = s3_a.replace(/.+?([a-z|A-Z|0-9|\s]+)$/, "$1");
                console.warn(s5);
                var s5_inv = s3_a.substr(0, s3_a.length - s5.length);
                result += s5_inv + "<ruby><rb>" + s5 + "</rb><rt>" + s3_b + "</rt></ruby>";
            } else {
                result += s3_a + "(" + s3_b + ")";
            }
        }
        return result;
    };

    RubyMarkupBase.isHandRegion = function (str) {
        return str.match(/\*[^\*]*\*$/) != null;
    };

    RubyMarkupBase.isAlphabet = function (str) {
        return str.match(/^[a-z|A-Z|0-9|\s]$/) != null;
    };

    RubyMarkupBase.isKanji = function (str, index) {
        return str.substr(index, 1).charAt(index).match(/[\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+$/) != null;
    };
    return RubyMarkupBase;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
