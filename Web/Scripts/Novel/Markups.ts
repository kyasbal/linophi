
class MarkupBase
{
    getMarkupString(str: string): string//マークアップ実行
    {
        return null;
    }
}

class MarkupStateData//後続のパラグラフへの通知データ
{
    constructor(isCncl:boolean)
    {
        this.isConclusion = isCncl;
    }
    public isConclusion:boolean;
}

class MarkupResult//マークアップ結果
{
    constructor(str: string, conclude: boolean,callback:boolean)
    {
        this.resultText = str;
        this.concludeFlag = conclude;
        this.callBackPrevFlag = callback;
    }
    public resultText: string;//処理後のテキスト
    public concludeFlag: boolean;//次の段落に影響するマークアップの有無
    public callBackPrevFlag:boolean;//前の段落へコールバックするか
}

class BoldMarkup extends MarkupBase //太字
{
    getMarkupString(str: string): string
    {
        var result: string = str;
        var rep: string;
        //var callbackFlag: boolean = false;

        //if (prevState != null && !prevState.isConclusion)//前の段落で閉じてなかった
        //{
        //    callbackFlag = true;
        //    rep = result.replace(/^(.*?[^\\])\*/, "<span class=\"b\">$1</span>");//前半を強調
        //    if (rep == result) //*が見つからないとき、強調せずに閉じてないことだけ通知
        //        return result;
        //    result = rep;
        //}
        result = result.replace(/^\*(.*?[^\\])\*/, "<span class=\"b\">$1</span>");
        while (true)//*に挟まれてるのを強調
        {
            rep = result.replace(/([^\\])\*(.*?[^\\])\*/, "$1<span class=\"b\">$2</span>");
            if (rep == result) break;
            result = rep;
        }

        //var check: string = result.replace(/[^\\]\*/, "");
        //if (check != result) return new MarkupResult(result, false, callbackFlag);//まだ一つペアになってない*が残ってる
        //return new MarkupResult(result, true, callbackFlag);//マークアップが閉じた
        return result;
    }
    //markupConcludeCallback(str: string): MarkupResult//後続でマークアップが閉じた
    //{
    //    var rep: string = str.replace(/[^\\]\*(.*?)$/, "<span class=\"b\">$1</span>");//最後の*の後ろを太字に
    //    if (rep == str)//*がなければ、全文が太字に
    //        return new MarkupResult("<span class=\"b\">" + str + "</span>", false, true);
    //    return new MarkupResult(rep, false,false);
    //}
    //getMarkupStateData(str: string): MarkupStateData
    //{
    //    var rep : string = str.replace(/[^\\]\*/, "");
    //    if (rep != str) return new MarkupStateData(false);
    //    return new MarkupStateData(true);
    //}
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

//class LinkMarkup extends MarkupBase
//{
//    getMarkupString(result: string, prevState: MarkupStateData): string
//    {
//        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(.jpg|.jpeg|.gif|.png)$)/g, "<Img Src=\"$1\">");
//        result = result.replace(/(^https?:\/\/[\x21-\x7e]+(?!(.jpg|.jpeg|.gif|.png))$)/g, "<a href='$1'>$1</a>");
//        return result;
//    }
//}