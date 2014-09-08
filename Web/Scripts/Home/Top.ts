interface HTMLElement
{
    getContext(str:string):any;
}

class PageBase {
    constructor() {
        this.header = $("header");
        this.footer = $("footer");
    }

    public header: JQuery;

    public footer: JQuery;
}

class ArticleLabelCount
{
    public surprised: number=0;

    public anger: number=0;

    public fun: number=0;

    public bethink: number=0;

    public good: number=0;

    public sad: number=0;

    public noidea:number=0;
}

interface IDelegateParseLabelInfoEachParagraph
{
    (paragraphId:string,data:any,itr:number);
}

interface IDelegeteParseCompleted
{
    (result:ArticleLabelCount);
}

class RandomArticleFetcher
{
    public lastResult: string;

    getNext(func:IDelegeteParseCompleted): void
    {
        $.ajax(
        {
            url: "/api/Article/GetRandomArticle",
            type: "post",
            success:(r)=> { this.getNextCompleted(r,func); }
        });
    }

    EachParagraph(data:any,func:IDelegateParseLabelInfoEachParagraph):void
    {
        var parsedInfo: any = JSON.parse(data.LabelInfo);
        for (var i = 0; i < parsedInfo.length; i++)
        {
            func(parsedInfo[i].ParagraphId, JSON.parse(parsedInfo[i].Data), i);
        }
    }

    getNextCompleted(result:any,completed:IDelegeteParseCompleted): void
    {
        var data: any = result;
        var count:ArticleLabelCount = new ArticleLabelCount();
        this.EachParagraph(data, (pid:string, pData:any, itr:number) =>
        {
            for (var i = 0; i < pData.length; i++)
            {
                if (count[pData[i].Key] !== 'undefined')
                {
                    count[pData[i].Key] += pData[i].Value;
                }
            }
        });
        completed(count);
    }

}

class TopPage extends PageBase
{
       constructor()
       {
           super();
           this.container = $(".container");
           this.graphCanvas = $("#top-graph");
           this.articleFetcher = new RandomArticleFetcher();
           $(window).resize(() => { this.adjustContentHeight(); });
           //this.canvasContext = document.getElementById("top-graph").getContext("2d");
       }

    public container: JQuery;

    public articleFetcher: RandomArticleFetcher;

    public canvasContext: any;

    public graphCanvas:JQuery;

    adjustContentHeight()
    {
        var containerHeight = window.innerHeight - this.header.height() - this.footer.height();
        this.container.height(containerHeight);
    }

    onRadorUpdate(count:ArticleLabelCount,context:any)
    {

    }

    UpdateRadar()
    {
        var nextCanvasContext: any=this.canvasContext;
        this.articleFetcher.getNext((c) =>
        {
            this.onRadorUpdate(c,nextCanvasContext);
        });
    }
}

var topPageManager: TopPage = new TopPage();
$(window).load(() =>
{
    topPageManager.adjustContentHeight();
    topPageManager.UpdateRadar();
});