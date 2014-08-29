$(() => {
    var m: BoldMarkup = new BoldMarkup();
    m.getMarkupString("今日は=いい天気で=す。|=あいうえお|=。かきく|=けこ=")
 });
    class MarkupBase
    {
        getMarkupString(str: string): string
        {
            return "Not Implemented";
        }
 }

 class BoldMarkup extends MarkupBase {
     getMarkupString(str: string): string {
         var result: string = "";
         result = str.replace(/\\\*/g, "\u0006\u0006");
         result = result.replace(/\*(.+?)\*/, "<span class=\"b\">$1</span>");
         result = result.replace(/\u0006\u0006/g, "*");
         return result;
    }
}

class QuoteMarkup extends MarkupBase {
    getMarkupString(str: string): string {
        var result: string = "";
        result = str.replace(/\\"/g, "\u0006\u0006");
        result = result.replace(/"(.+?)"/, "<blockquote><p class=\"quote\">$1</p></blockquote>");
        result = result.replace(/\u0006\u0006/g, "\"");
        return result;
    }
}

class LinkMarkup extends MarkupBase {
    getMarkupString(result: string): string {
        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(.jpg|.jpeg|.gif|.png)$)/g, "<Img Src=\"$1\">");
        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(?!(.jpg|.jpeg|.gif|.png))$)/g, "<a href='$1'>$1</a>");
        return result;
    }
}