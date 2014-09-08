var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PageBase = (function () {
    function PageBase() {
        this.header = $("header");
        this.footer = $("footer");
    }
    return PageBase;
})();

var ArticleLabelCount = (function () {
    function ArticleLabelCount() {
        this.surprised = 0;
        this.anger = 0;
        this.fun = 0;
        this.bethink = 0;
        this.good = 0;
        this.sad = 0;
        this.noidea = 0;
    }
    return ArticleLabelCount;
})();

var RandomArticleFetcher = (function () {
    function RandomArticleFetcher() {
    }
    RandomArticleFetcher.prototype.getNext = function (func) {
        var _this = this;
        $.ajax({
            url: "/api/Article/GetRandomArticle",
            type: "post",
            success: function (r) {
                _this.getNextCompleted(r, func);
            }
        });
    };

    RandomArticleFetcher.prototype.EachParagraph = function (data, func) {
        var parsedInfo = JSON.parse(data.LabelInfo);
        for (var i = 0; i < parsedInfo.length; i++) {
            func(parsedInfo[i].ParagraphId, JSON.parse(parsedInfo[i].Data), i);
        }
    };

    RandomArticleFetcher.prototype.getNextCompleted = function (result, completed) {
        var data = result;
        var count = new ArticleLabelCount();
        this.EachParagraph(data, function (pid, pData, itr) {
            for (var i = 0; i < pData.length; i++) {
                if (count[pData[i].Key] !== 'undefined') {
                    count[pData[i].Key] += pData[i].Value;
                }
            }
        });
        completed(count);
    };
    return RandomArticleFetcher;
})();

var TopPage = (function (_super) {
    __extends(TopPage, _super);
    function TopPage() {
        var _this = this;
        _super.call(this);
        this.container = $(".container");
        this.graphCanvas = $("#top-graph");
        this.articleFetcher = new RandomArticleFetcher();
        $(window).resize(function () {
            _this.adjustContentHeight();
        });
        this.canvasContext = document.getElementById("top-graph").getContext("2d");
    }
    TopPage.prototype.adjustContentHeight = function () {
        var containerHeight = window.innerHeight - this.header.height() - this.footer.height();
        this.container.height(containerHeight);
    };

    TopPage.prototype.onRadorUpdate = function (count, context) {
    };

    TopPage.prototype.UpdateRadar = function () {
        var _this = this;
        var nextCanvasContext = this.canvasContext;
        this.articleFetcher.getNext(function (c) {
            _this.onRadorUpdate(c, nextCanvasContext);
        });
    };
    return TopPage;
})(PageBase);

var topPageManager = new TopPage();
$(window).load(function () {
    topPageManager.adjustContentHeight();
    topPageManager.UpdateRadar();
});
//# sourceMappingURL=Top.js.map
