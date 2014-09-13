var frameManager: FrameManager;
$(() =>
{
    frameManager = new FrameManager();

});
window.load = function()
{
    frameManager.updatePosition();
}
interface HTMLElement
{
    src:string;
}
class FrameManager
{
    private targetContainer: JQuery = $(".preview-iframes");
    private calledIds:collections.Set<string>=new collections.Set<string>();

    public NicoMove(id:string): void
    {
        
        var target: JQuery = $(".iframe-" + id);
        if (target.length != 0)
        {
            if (this.calledIds.contains(id))
            {
                var href: string = target.attr("data-link");
                var movieId: string = target.attr("data-movie-id");
                window.open(href);
                var iframe = document.getElementById("nico-" + id);
                iframe.src = "/Content/Nico?id=" + movieId;
                this.calledIds.remove(id);
            } else
            {
                this.calledIds.add(id);
            }
        }
    }

    public updatePosition(): void
    {
        var removeList: collections.Set<string> = new collections.Set<string>();
        var moveList: collections.Set<string> = new collections.Set<string>();
        var container = $(".preview-iframes iframe");
        container.each((i, e:Element) =>
        {
            var group: string = e.getAttribute("group");
            var jq: JQuery = $(".preview-body .iframe-box-" + group);
            if (jq.length == 0)
            {
                removeList.add(group);
            } else
            {
                moveList.add(group);
            }
        });
        removeList.forEach((st) =>
        {
            $(".preview-iframes .iframe-" + st).remove();
            return true;
        });
        moveList.forEach((st) =>
        {
            var offset = $(".preview-body .iframe-box-" + st).offset();
            var container = $(".preview-body").offset();
            var top = offset.top - container.top;
            $(".preview-iframes .iframe-" + st).css({
                "position": "absolute",
                "top": top,
                "left": offset.left - container.left
        });
            return true;
        });
    }

    public addIframe(id:string,hash:string,tag:JQuery):void
    {
        var targetIframe: JQuery = $(".preview-iframes .iframe-" + id);
        if (targetIframe.length == 0)
        {
            
        } else
        {
            if(targetIframe.attr("hash")!=hash)
                targetIframe.remove();
            else
            {
                return;
            }
        }
        tag.addClass("iframe-" + id);
        tag.attr("group", id);
        tag.attr("hash", hash);
        $(".preview-iframes").append(tag);
    }

}
class MarkupBase
{
    getMarkupString(str: string,id:string): string//マークアップ実行
    {
        return null;
    }
}

/*
class QuoteMarkup extends MarkupBase
{
    getMarkupString(str: string, id: string): string
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
*/

class BoldMarkup extends MarkupBase //太字
{
    getMarkupString(str: string, id: string): string
    {
        var result: string = str;
        var rep: string;

        result = result.replace(/^\*(.*?[^\\])\*/, "<strong class=\"b\">$1</strong>");
        while (true)//*に挟まれてるのを強調
        {
            rep = result.replace(/([^\\])\*(.*?[^\\])\*/, "$1<strong class=\"b\">$2</strong>");
            if (rep == result) break;
            result = rep;
        }

        return result.replace(/\\\*/,"*");
    }
}

class LinkMarkup extends MarkupBase//URL
{
    getMarkupString(result: string, id: string): string
    {
        console.warn("link");
        result = result.replace(/&ensp;/g, "\u0006h");
        if (result.match(/(https?:\/\/[＠@\w\/:%#\$&\?\(\)~\.=\+\-_]+(\.jpg|\.jpeg|\.gif|\.png))/g))
        {
            result = result.replace(/(https?:\/\/[＠@\w\/:%#\$&\?\(\)~\.=\+\-_]+(\.jpg|\.jpeg|\.gif|\.png))/g, "<Img Src=\"/Pages/ContentUpload/ServerCache?url=$1\">");
        }
        result = result.replace(/(https?:\/\/[＠@\w\/:%#\$&\?\(\)~\.=\+\-_\;]+)([^\w\/:%#\$&\?\(\)~\.=\+\-@\;])(?![>"'])/g, "<a href='$1'>$1</a>$2");
        result = result.replace(/(https?:\/\/[＠@\w\/:%#\$&\?\(\)~\.=\+\-_\;]+)$/, "<a href='$1'>$1</a>");
        return result.replace(/\u0006h/g, "&ensp;");
    }
}

class YoutubeMarkup extends MarkupBase//ようつべ
{
    getMarkupString(result: string, id: string): string
    {
        if (result.match(/https?:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/))
        {
            var movieId = result.replace(/https?:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/, "$1");
            frameManager.addIframe(id,"youtube-"+movieId , $("<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/"+movieId+"\" frameborder=\"0\" allowfullscreen></iframe>"));
            result = result.replace(/https?:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/, "<div class=\"d-"+id+" youtube-box iframe-box-" + id + " movie-id-"+movieId+"\" data-movie-id=\""+movieId+"\"></div>");
        }
        return result;
    }
}

class NikonikoMarkup extends MarkupBase
{
    getMarkupString(result: string, id: string): string
    {
        if (result.match(/^http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/))
        { //ニコ動はiframeだと、動画クリック時に変移する先のページを表示できない為、いろいろややこしい。
            var src = result.replace(/(http:\/\/www\.nicovideo\.jp\/\watch\/ [\w]+)/, "$1");
            var hash = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "$1");
            var tag = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "<iframe id=\"nico-" + id + "\" onload=\"frameManager.NicoMove('" + id + "');\" data-link=\"" + src + "\" data-movie-id=\"" + hash + "\"   width=\"560px\" height=\"315px\" src=\"/Content/Nico?id=$1\" scrolling=\"no\" frameborder=\"0\"></iframe>");
            frameManager.addIframe(id, "nico-" + hash, $(tag));
            result = result.replace(/http:\/\/www\.nicovideo\.jp\/\watch\/([\w]+)/, "<div class=\"d-" + id + " niko-box iframe-box-" + id + " movie-id-" + hash + "\"></div>");
        }
        return result;
    }
}

//横棒のやつ
class HrMarkUp extends MarkupBase
{
    getMarkupString(result: string): string
    {
        result = result.replace(/-----/, "<hr>");
        return result;
    }
}

//アドレス
class UrlMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        if (result.match(/\$\([^)]+\)\{[^}]+}/g))
        {
            var url = result.replace(/\$\(([^)]+)\)\{([^}]+)}/g, "$1");
            url = url.replace(/http/g, "\u0006e");
            result = result.replace(/\$\(([^)]+)\)\{([^}]+)}/g, "<a href='"+url+"'>$2</a>");
        }
        else
        {
            var url = result.replace(/\$\(([^)]+)\).*/g, "$1");
            url = url.replace(/http/g, "\u0006e");
            result = result.replace(/\$\(([^)]+)\)/g, "<a href=\"" + url+"\">"+url+"</a>");
        }
        result = result.replace(/<a[^>]+><\/a>/g, "");
        console.warn(result);
        return result;
    }
}

//色変え
class ColorMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        result = result.replace(/\$color\(([^)]+)\)\{([^}]+)}/g,"<span class=\"$1\">$2</span>");
        return result;
    }
}

class SizeMarkup extends MarkupBase
{
    getMarkupString(result: string): string {
        result = result.replace(/\$size\(([^)]+)\)\{([^}]+)}/g, "<span class=\"$1\">$2</span>");
        result = result.replace(/<\div>\n<br>/g,"");
        return result;
    }
}

class SizeColorMarkup extends MarkupBase {
    getMarkupString(result: string): string {
        result = result.replace(/\$sizecolor\(([^),]+),([^)]+)\)\{([^}]+)}/g, "<span class=\"$1 $2\">$3</span>");
        return result;
    }
}


/*
class BgcMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        result = result.replace(/bgc{(.*?)}g/, "<div class=\"bgcg\">$1</div>");
        result = result.replace(/bgc{(.*?)}s/, "<div class=\"bgcs\">$1</div>");
        return result;
    }
}
*/

/*
class ListMarkup extends MarkupBase
{
    getMarkupString(result: string): string
    {
        if (result.match("listn{.*}"))
        {
            result = result.replace(/listn{(.+)}/g, "<ol style=\"list-style-type:decimal\"><li>$1</li></ol>");
            result = result.replace(/<\/br>/g, "</li><li>");
        }
        if (result.match("listd{.*}"))
        {
            result = result.replace(/listd{(.+)}/g, "<ul style=\"list-style-type:disc\"><li>$1</li></ul>");
            result = result.replace(/<\/br>/g, "</li><li>");
        }
        result = result.replace(/<li><\/li>/g, "");
        result = result.replace(/\\{(.*)<\/li>/g, "<br><span>$1</span>");
        return result;
    }
}
*/