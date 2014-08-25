var NovelEditer;
(function (NovelEditer) {
    var ParagraphFactory = (function () {
        function ParagraphFactory() {
            this._manager = new NovelEditer.ParagraphManager();
        }
        ParagraphFactory.prototype.createParagraph = function (json) {
            var ret = new NovelEditer.Paragraph(this._manager, "");
            ret.fromJSON(json);
            return ret;
        };

        ParagraphFactory.prototype.rebuildParagraphs = function (json) {
            var firstParagraph, cacheParagraph;
            firstParagraph = cacheParagraph = new NovelEditer.Paragraph(this._manager, "");
            var jsonObjects = JSON.parse(json);
            for (var i = 0; i < jsonObjects.length; i++) {
                cacheParagraph.fromJSON(jsonObjects[i]);
                cacheParagraph = new NovelEditer.Paragraph(this._manager, "");
            }
            return firstParagraph;
        };
        return ParagraphFactory;
    })();
    NovelEditer.ParagraphFactory = ParagraphFactory;
})(NovelEditer || (NovelEditer = {}));
//# sourceMappingURL=ParagraphFactory.js.map
