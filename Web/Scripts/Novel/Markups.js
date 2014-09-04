var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var frameManager;
$(function () {
    frameManager = new FrameManager();
});

var FrameManager = (function () {
    function FrameManager() {
        this.targetContainer = $(".preview-iframes");
        this.calledIds = new collections.Set();
    }
    FrameManager.prototype.NicoMove = function (id) {
        var target = $(".iframe-" + id);
        if (target.length != 0) {
            if (this.calledIds.contains(id)) {
                var href = target.attr("data-link");
                var movieId = target.attr("data-movie-id");
                window.open(href);
                var iframe = document.getElementById("nico-" + id);
                iframe.src = "/Content/Nico?id=" + movieId;
                this.calledIds.remove(id);
            } else {
                this.calledIds.add(id);
            }
        }
    };

    FrameManager.prototype.updatePosition = function () {
        var removeList = new collections.Set();
        var moveList = new collections.Set();
        var container = $(".preview-iframes iframe");
        container.each(function (i, e) {
            var group = e.getAttribute("group");
            var jq = $(".preview-body .iframe-box-" + group);
            if (jq.length == 0) {
                removeList.add(group);
            } else {
                moveList.add(group);
            }
        });
        removeList.forEach(function (st) {
            $(".preview-iframes .iframe-" + st).remove();
            return true;
        });
        moveList.forEach(function (st) {
            var offset = $(".preview-body .iframe-box-" + st).offset();
            var top = offset.top - $(".preview-body").offset().top;
            $(".preview-iframes .iframe-" + st).css({
                "position": "absolute",
                "top": top,
                "left": offset.left
            });
            return true;
        });
    };

    FrameManager.prototype.addIframe = function (id, hash, tag) {
        var targetIframe = $(".preview-iframes .iframe-" + id);
        if (targetIframe.length == 0) {
        } else {
            if (targetIframe.attr("hash") != hash)
                targetIframe.remove();
            else {
                return;
            }
        }
        tag.addClass("iframe-" + id);
        tag.attr("group", id);
        tag.attr("hash", hash);
        $(".preview-iframes").append(tag);
    };
    return FrameManager;
})();
var MarkupBase = (function () {
    function MarkupBase() {
    }
    MarkupBase.prototype.getMarkupString = function (str, id) {
        return null;
    };
    return MarkupBase;
})();

var QuoteMarkup = (function (_super) {
    __extends(QuoteMarkup, _super);
    function QuoteMarkup() {
        _super.apply(this, arguments);
    }
    QuoteMarkup.prototype.getMarkupString = function (str, id) {
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
    BoldMarkup.prototype.getMarkupString = function (str, id) {
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
    LinkMarkup.prototype.getMarkupString = function (result, id) {
        console.warn("link");
        result = result.replace(/&ensp;/g, "\u0006");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-_]+(\.jpg|\.jpeg|\.gif|\.png))/g, "<Img Src=\"$1\">");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-_]+)([^\w\/:%#\$&\?\(\)~\.=\+\-])(?![>"])/g, "<a href='$1'>$1</a>$2");
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
    YoutubeMarkup.prototype.getMarkupString = function (result, id) {
        if (result.match(/https:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/)) {
            var movieId = result.replace(/https:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/, "$1");
            frameManager.addIframe(id, "youtube-" + movieId, $("<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/" + movieId + "\" frameborder=\"0\" allowfullscreen></iframe>"));
            result = result.replace(/https:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/, "<div class=\"youtube-box iframe-box-" + id + " movie-id-" + movieId + "\" data-movie-id=\"" + movieId + "\"></div>");
        }
        return result;
    };
    return YoutubeMarkup;
})(MarkupBase);
var NikonikoMarkup = (function (_super) {
    __extends(NikonikoMarkup, _super);
    function NikonikoMarkup() {
        _super.apply(this, arguments);
    }
    NikonikoMarkup.prototype.getMarkupString = function (result, id) {
        if (result.match(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/)) {
            var src = result.replace(/(http:\/\/www\.nicovideo\.jp\/\watch\/ [\w]+)/, "$1");
            var hash = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "$1");
            var tag = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "<iframe id=\"nico-" + id + "\" onload=\"frameManager.NicoMove('" + id + "');\" data-link=\"" + src + "\" data-movie-id=\"" + hash + "\"   width=\"560px\" height=\"315px\" src=\"/Content/Nico?id=$1\" scrolling=\"no\" frameborder=\"0\"></iframe>");
            frameManager.addIframe(id, "nico-" + hash, $(tag));
            result = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "<div class=\"niko-box iframe-box-" + id + " movie-id-" + hash + "\"></div>");
        }
        return result;
    };
    return NikonikoMarkup;
})(MarkupBase);
//# sourceMappingURL=Markups.js.map
