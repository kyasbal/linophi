var s = (html: string): string =>
{
    var stramp = '&amp;',
        strlt = '&lt;',
        strquot = '&quot;',
        strgt = '&gt;',
        strlf = '<br>',
        amp = new RegExp('&', 'g'),
        lt = new RegExp('<', 'g'),
        quot = new RegExp('"', 'g'),
        gt = new RegExp('>', 'g'),
        lf = new RegExp('\n', 'g');
    /*
    var strcr = '',
        cr = new RegExp('\r', 'g');
    */
    return html
            .replace(amp, stramp)
            .replace(lt, strlt)
            .replace(quot, strquot)
            .replace(gt, strgt)
            .replace(lf, strlf);
}

var getParagraphId = (seedClass: string): string =>
{
    return seedClass.replace(/x_/, '');
}