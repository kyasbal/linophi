var s = (html: string): string =>
{
    var stramp = '&amp;',
        strlt = '&lt;',
        strquot = '&quot;',
        strgt = '&gt;',
        amp = new RegExp('&', 'g'),
        lt = new RegExp('<', 'g'),
        quot = new RegExp('"', 'g'),
        gt = new RegExp('>', 'g');
    /*
    var strcr = '',
        cr = new RegExp('\r', 'g');
    */
    return html
            .replace(amp, stramp)
            .replace(lt, strlt)
            .replace(quot, strquot)
            .replace(gt, strgt);
}