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
         result = result.replace(/\*(?!\\)(.+?)\*(?!\\)/, "<span class=\"b\">$1</span>");
         result = result.replace(/\u0006\u0006/g, "*");
         return result;
    }
 }