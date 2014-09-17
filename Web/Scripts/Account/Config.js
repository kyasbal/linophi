var name;
var length;

$(function () {
    $(window).resize(function () {
        LoginPage.adjustHeight();
    });
    ConfigPage.adjustHeight();
    $(".config-submit").click(function () {
        $(".config-form").submit();
    });

    $(".name").keyup(function () {
        name = $(this).val();
        length = name.length;
        if (length < 2) {
            $(".config-submit").css('display', 'none');
            $(".error-message").css('opacity', 1);
        } else if (length > 15) {
            $(".config-submit").css('display', 'none');
            $(".error-message").css('opacity', 1);
        } else {
            $(".config-submit").css('display', 'inline');
            $(".error-message").css('opacity', 0);
        }
    });
});

var ConfigPage;
(function (ConfigPage) {
    function getEntireHeight($elem) {
        return $elem.outerHeight(true);
    }
    ConfigPage.getEntireHeight = getEntireHeight;

    function adjustHeight() {
        var header = $("header");
        var footer = $(".foot");
        var calcedMargin = $(window).innerHeight() - getEntireHeight(header) - getEntireHeight(footer) - $(".layout").innerHeight();
        $(".layout").css({
            'margin-bottom': Math.max(0, calcedMargin / 2),
            'margin-top': Math.max(0, calcedMargin / 2)
        });
    }
    ConfigPage.adjustHeight = adjustHeight;
})(ConfigPage || (ConfigPage = {}));
//# sourceMappingURL=Config.js.map
