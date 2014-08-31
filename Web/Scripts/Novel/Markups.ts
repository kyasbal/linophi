
class MarkupBase
{
    getMarkupString(str: string): string//マークアップ実行
    {
        return null;
    }
}

class QuoteMarkup extends MarkupBase {
    getMarkupString(str: string): string {
        var result: string = "";
        result = str.replace(/\\"/g, "\u0006\u0006");
        if (result.match(/"(.+?)(\{.*?\})"/)) {
            result = result.replace(/"(.+?)\{(.*?)\}"/, "<blockquote><div class=\"quote\"><p class=\"quote-body\">$1</p></br><p class=\"source\">出典:$2</p></div></blockquote>");
        } else {
            result = result.replace(/"(.+?)"/, "<blockquote><p class=\"quote\">$1</p></blockquote>");
        }
        result = result.replace(/\u0006\u0006/g, "\"");
        return result;
    }
}

class BoldMarkup extends MarkupBase //太字
{
    getMarkupString(str: string): string
    {
        var result: string = str;
        var rep: string;

        result = result.replace(/^\*(.*?[^\\])\*/, "<span class=\"b\">$1</span>");
        while (true)//*に挟まれてるのを強調
        {
            rep = result.replace(/([^\\])\*(.*?[^\\])\*/, "$1<span class=\"b\">$2</span>");
            if (rep == result) break;
            result = rep;
        }

        return result.replace(/\\\*/,"*");
    }
}

//class QuoteMarkup extends MarkupBase 
//{
//    getMarkupString(str: string, prevState: MarkupStateData): MarkupResult
//    {
//        var result: string = str;
//        //result = str.replace(/\\"/g, "\u0006\u0006");
//        result = result.replace(/\\"/g, "\\\\\"");//エスケープ
//        result = "a" + result;
//        while (true)
//        {
//            var rep: string = result.replace(/([^\\])"(.*?[^\\])"/, "$1<blockquote><p class=\\\"quote\\\">$2</p></blockquote>");
//            if (rep == result) break;
//            result = rep;
//        }
//        //result = result.replace(/"(.+?)"/, "<blockquote><p class=\"quote\">$1</p></blockquote>");
//        //result = result.replace(/\u0006\u0006/g, "\"");

//        var check: string = result.replace(/[^\\]"/, "");
//        if (check != result) return new MarkupResult(result.replace(/\\"/g, "\"").substr(1), false, false);
//        return new MarkupResult(result.replace(/\\"/g, "\"").substr(1), true,false);
//    }
//    markupConcludeCallback(str: string): MarkupResult//後続でマークアップが閉じた
//    {
//        str = str.replace(/<blockquote><p class="quote">/, "<blockquote><p class=\\\"quote\\\">");
//        var rep: string = str.replace(/([^\\])"(.*?)$/, "$1<blockquote><p class=\\\"quote\\\">$2</p></blockquote>");
//        if (rep == str) return new MarkupResult("<blockquote><p class=\"quote\">"+str.replace(/\\"/g,"\"")+"</p></blockquote>", false,false);
//        return new MarkupResult(rep.replace(/\\"/g, "\""), true,false);
//    }
//    getMarkupStateData(str: string): MarkupStateData
//    {
//        str = str.replace(/<blockquote><p class="quote">/, "<blockquote><p class=\\\"quote\\\">");
//        var rep: string = str.replace(/[^\\]"/, "");
//        if (rep != str) return new MarkupStateData(false);
//        return new MarkupStateData(true);
//    }
//}

class LinkMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        result = result.replace(/&ensp;/g, "\u0006");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+(\.jpg|\.jpeg|\.gif|\.png))/g, "<Img Src=\"$1\">");
        //var m = result.match(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)[^\w\/:%#\$&\?\(\)~\.=\+\-](?!>)/g);
        //var m2 = result.match(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/);
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)([^\w\/:%#\$&\?\(\)~\.=\+\-])(?!>)/g, "<a href='$1'>$1</a>$2");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/, "<a href='$1'>$1</a>");
        return result.replace(/\u0006/g, "&ensp;");
    }
}
