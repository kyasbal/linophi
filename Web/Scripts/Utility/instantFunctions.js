var s = function (html) {
    var stramp = '&amp;', strlt = '&lt;', strquot = '&quot;', strgt = '&gt;', amp = new RegExp('&', 'g'), lt = new RegExp('<', 'g'), quot = new RegExp('"', 'g'), gt = new RegExp('>', 'g');

    /*
    var strcr = '',
    cr = new RegExp('\r', 'g');
    */
    return html.replace(amp, stramp).replace(lt, strlt).replace(quot, strquot).replace(gt, strgt);
};

var getParagraphId = function (seedClass) {
    return seedClass.replace(/x_/, '');
};
//# sourceMappingURL=instantFunctions.js.map
