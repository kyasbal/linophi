var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var novelViewer;
$(function () {
    novelViewer = new NovelViewer($("#left-inner"), $("#right-inner"));
});
var NovelViewer = (function () {
    function NovelViewer(left, right) {
        this._paragraphFetcher = new DummyParagraphFetcher(this._paragraphFactory);
        this.leftSide = left;
        this.rightSide = right;
        this._paragraphFactory = new NovelEditer.ParagraphFactory();
        this.updateView();
    }
    NovelViewer.prototype.updateView = function () {
        this.rightSide.html(this._paragraphFactory.rebuildParagraphs('[{"prevParagraph":null,"nextParagraph":"d8FujlKBLs","rawText":"あいうえお","paragraphIndex":0,"id":"7GosOjRM07"},{"prevParagraph":"7GosOjRM07","nextParagraph":"z1sdanSeXU","rawText":"かきくけこ","paragraphIndex":1,"id":"d8FujlKBLs"},{"prevParagraph":"d8FujlKBLs","nextParagraph":"rzLq21F9jp","rawText":"さしすせそ","paragraphIndex":2,"id":"z1sdanSeXU"},{"prevParagraph":"z1sdanSeXU","nextParagraph":"TEiM0Odh01","rawText":"たちつてと","paragraphIndex":3,"id":"rzLq21F9jp"},{"prevParagraph":"rzLq21F9jp","nextParagraph":null,"rawText":"","paragraphIndex":4,"id":"TEiM0Odh01"}]').getParagraphHtmls(3));
    };
    return NovelViewer;
})();

var ParagraphFetcher = (function () {
    function ParagraphFetcher(factory) {
        this._paragraphFactory = factory;
    }
    ParagraphFetcher.prototype.getParagraph = function (from, to) {
        return null;
    };
    return ParagraphFetcher;
})();

var DummyParagraphFetcher = (function (_super) {
    __extends(DummyParagraphFetcher, _super);
    function DummyParagraphFetcher() {
        _super.apply(this, arguments);
    }
    return DummyParagraphFetcher;
})(ParagraphFetcher);
//# sourceMappingURL=novel-viewer.js.map
