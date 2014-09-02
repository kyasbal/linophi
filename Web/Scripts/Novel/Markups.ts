
class MarkupBase
{
    getMarkupString(str: string): string//マークアップ実行
    {
        return null;
    }
}

class QuoteMarkup extends MarkupBase
{
    getMarkupString(str: string): string
    {
        var result: string = "";
        result = str.replace(/\\"/g, "\u0006\u0006");
        if (result.match(/"(.+?)(\{.*?\})"/))
        {
            result = result.replace(/"(.+?)\{(.*?)\}"/, "<blockquote><div class=\"quote\"><p class=\"quote-body\">$1</p></br><p class=\"source\">出典:$2</p></div></blockquote>");
        } else
        {
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

class LinkMarkup extends MarkupBase//URL
{
    getMarkupString(result: string): string
    {
        result = result.replace(/&ensp;/g, "\u0006");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+(\.jpg|\.jpeg|\.gif|\.png))/g, "<Img Src=\"$1\">");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)([^\w\/:%#\$&\?\(\)~\.=\+\-])(?!>)/g, "<a href='$1'>$1</a>$2");
        result = result.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/, "<a href='$1'>$1</a>");
        return result.replace(/\u0006/g, "&ensp;");
    }
}

class YoutubeMarkup extends MarkupBase//ようつべ
{
    getMarkupString(result: string): string
    {
        result = result.replace(/https:\/\/www\.youtube\.com\/watch\?v=([\w]+)/,
            "<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/$1\" frameborder=\"0\" allowfullscreen></iframe>");
        return result;
    }
}
class NikonikoMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        result = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/,
            "<script type = \"text\/javascript\"src=\"http://ext.nicovideo.jp/thumb_watch/$1?w=490&h=307\" ></script><noscript><a href=\"http://www.nicovideo.jp/watch/$1\">同がリンク</a></noscript>");
        return result;
    }
}
