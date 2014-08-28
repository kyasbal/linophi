var paragraphFactory = new NovelEditer.ParagraphFactory();
$(function () {
    var raw = $("#article-source").text();
    if (raw == "")
        return;
    var data = JSON.parse(raw);
    var sortedData = _.sortBy(data.Paragraphs, function (d) {
        return d.paragraphIndex;
    });
    $(".article-container").html(paragraphFactory.rebuildParagraphs(JSON.stringify(sortedData)).getParagraphHtmls(sortedData.length));
    $(".article-title").html(data.ArticleTitle);
});
//});
//class NovelViewer
//{
//    private leftSide: JQuery;
//
//    private rightSide:JQuery;
//
//    private _finalLoadedParagraph: IParagraph;
//
//    _paragraphFactory: NovelEditer.ParagraphFactory;
//
//    private _paragraphFetcher:ParagraphFetcher=new DummyParagraphFetcher(this._paragraphFactory);
//
//    constructor(left:JQuery,right:JQuery)
//    {
//        this.leftSide = left;
//        this.rightSide = right;
//        this._paragraphFactory = new NovelEditer.ParagraphFactory();
//        this.updateView();
//    }
//
//    updateView()
//    {
//        this.rightSide.html(this._paragraphFactory.rebuildParagraphs('[{"prevParagraph":null,"nextParagraph":"d8FujlKBLs","rawText":"あいうえお","paragraphIndex":0,"id":"7GosOjRM07"},{"prevParagraph":"7GosOjRM07","nextParagraph":"z1sdanSeXU","rawText":"かきくけこ","paragraphIndex":1,"id":"d8FujlKBLs"},{"prevParagraph":"d8FujlKBLs","nextParagraph":"rzLq21F9jp","rawText":"さしすせそ","paragraphIndex":2,"id":"z1sdanSeXU"},{"prevParagraph":"z1sdanSeXU","nextParagraph":"TEiM0Odh01","rawText":"たちつてと","paragraphIndex":3,"id":"rzLq21F9jp"},{"prevParagraph":"rzLq21F9jp","nextParagraph":null,"rawText":"","paragraphIndex":4,"id":"TEiM0Odh01"}]').getParagraphHtmls(3));
//    }
//}
//
//class ParagraphFetcher
//{
//    _paragraphFactory:NovelEditer.ParagraphFactory;
//
//    constructor(factory:NovelEditer.ParagraphFactory)
//    {
//        this._paragraphFactory = factory;
//    }
//    getParagraph(from: number, to: number):IParagraph
//    {
//        return null;
//    }
//}
//
//class DummyParagraphFetcher extends ParagraphFetcher
//{
//
//}
//# sourceMappingURL=novel-viewer.js.map
