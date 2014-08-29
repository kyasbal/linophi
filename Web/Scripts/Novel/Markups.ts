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
         while (true) {
             var strCache: string = str;
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
    }
 }