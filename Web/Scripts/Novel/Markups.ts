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

    class RubyMarkupBase extends MarkupBase
    {
        getMarkupString(str: string): string
        {
            return RubyMarkupBase.toRubyExpression(str);
        }
        
        static toRubyExpression(str: string)
        {
            var result: string = "";
            while (true)
            {
                
                var strCache: string = str;
                var s = str.replace(/\|[\(\)]/g, "@@");
                var s2 = s.replace(/^(.*?[\(].+?[\)]).*$/, "$1");
                var s3_a = s2.replace(/^(.*)?[\(].+?[\)]$/, "$1");
                s3_a = str.substr(0, s3_a.length);
                str = str.substr(s2.length, str.length - s2.length);
                if (str.length == 0 && s.match(/^(.+?[\(].+?[\)])$/)==null)
                {
                    result += strCache.substr(0, s2.length).replace(/\|\(/g,"(");
                    break;
                }
                console.warn("str:"+str);
                s3_a = s3_a.replace(/\|\(/g, "(").replace(/\|\)/g, ")");;
                var s3_b = s2.replace(/^.*?[\(](.+)?[\)]$/, "$1");
                var cachedS2: string = strCache.substr(0, s2.length);
                var l = s3_b.length;
                s3_b = cachedS2.substr(s3_a.length + 1, l).replace(/\|\(/g, "(").replace(/\|\)/g, ")");;
                console.info("s2=" + s2);
                console.info("s3-a=" + s3_a);
                console.info("s3-b=" + s3_b);
                var c1 = s3_a.charAt(s3_a.length - 1);
                console.info("c1=" + c1);
                if (c1 == "*" && RubyMarkupBase.isHandRegion(s3_a))
                {
                    var s6 = s3_a.replace(/^.*\*([^\*]+)\*$/, "$1");
                    console.warn("s6:" + s6);
                    var s6_inv = s3_a.substr(0, s3_a.length-s6.length - 2);
                    console.warn("inv_s6:" + s6_inv);
                    result += s6_inv + "<ruby><rb>" + s6 + "</rb><rt>" + s3_b + "</rt></ruby>";
                    continue;
                }


                if (RubyMarkupBase.isKanji(c1, 0))
                {
                    console.info("漢字/自動ルピ");
                    var count: number = 1;
                    while (true)
                    {
                        if (s3_a.length - count == -1|| !RubyMarkupBase.isKanji(s3_a.charAt(s3_a.length - count), 0))
                        {
                            count--;
                            break;
                        }
                        count++;
                    }
                    var s4 = s3_a.substr(s3_a.length - count , count);
                    console.warn("count:" + count);
                    console.warn(s4);
                    var s4_inv = s3_a.substr(0, s3_a.length  - count);
                    console.warn(s4_inv);
                    result += s4_inv + "<ruby><rb>" + s4 + "</rb><rt>" + s3_b + "</rt></ruby>";
                } else if (RubyMarkupBase.isAlphabet(c1))
                {
                    console.info("アルファベット/自動ルピ");
                    var s5 = s3_a.replace(/.+?([a-z|A-Z|0-9|\s]+)$/, "$1");
                    console.warn(s5);
                    var s5_inv = s3_a.substr(0, s3_a.length - s5.length);
                    result += s5_inv + "<ruby><rb>" + s5 + "</rb><rt>" + s3_b + "</rt></ruby>";
                } else
                {
                    result += s3_a+"("+s3_b+")";
                }
            }
            return result;
        }

        static isHandRegion(str: string)
        {
            return str.match(/\*[^\*]*\*$/) != null;
        }

        static isAlphabet(str: string)
        {
            return str.match(/^[a-z|A-Z|0-9|\s]$/) != null;
        }
        
        
        static isKanji(str: string, index: number):boolean
        {
            return str.substr(index, 1).charAt(index).match(/[\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+$/)!=null;
        }
    }