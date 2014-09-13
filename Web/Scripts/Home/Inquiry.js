$(function () {
    $(".submit-inquiry").click(function () {
        $(".inquiry-form").submit();
    });
    InquiryPage.adjustHeight();
    $(window).resize(function () {
        InquiryPage.adjustHeight();
    });
});

var InquiryPage;
(function (InquiryPage) {
    function getEntireHeight($elem) {
        return $elem.outerHeight(true);
    }
    function adjustHeight() {
        var header = $("header");
        var footer = $(".foot");
        var calcedMargin = $(window).innerHeight() - getEntireHeight(header) - getEntireHeight(footer) - $(".layout").innerHeight();
        $(".layout").css({
            'margin-bottom': Math.max(0, calcedMargin / 2 - 1),
            'margin-top': Math.max(0, calcedMargin / 2 - 1)
        });
    }
    InquiryPage.adjustHeight = adjustHeight;
})(InquiryPage || (InquiryPage = {}));
//# sourceMappingURL=Inquiry.js.map
