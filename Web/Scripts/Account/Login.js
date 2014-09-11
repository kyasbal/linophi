$(function () {
    $(window).resize(function () {
        LoginPage.adjustHeight();
    });
    LoginPage.adjustHeight();
});

var LoginPage;
(function (LoginPage) {
    function getEntireHeight($elem) {
        return $elem.outerHeight(true);
    }
    LoginPage.getEntireHeight = getEntireHeight;

    function adjustHeight() {
        var header = $("header");
        var footer = $(".foot");
        var calcedMargin = $(window).innerHeight() - LoginPage.getEntireHeight(header) - LoginPage.getEntireHeight(footer) - $(".layout").innerHeight();
        $(".layout").css({
            'margin-bottom': Math.max(0, calcedMargin / 2),
            'margin-top': Math.max(0, calcedMargin / 2)
        });
    }
    LoginPage.adjustHeight = adjustHeight;
})(LoginPage || (LoginPage = {}));
//# sourceMappingURL=Login.js.map
