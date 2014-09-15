$(() =>
{

    $(".submit-inquiry").click(() =>
    {
        $(".inquiry-form").submit();
    });
    InquiryPage.adjustHeight();
    $(window).resize(() => { InquiryPage.adjustHeight(); });
});

module InquiryPage {
    function getEntireHeight($elem: JQuery): number {
        return $elem.outerHeight(true);
    }
    export function adjustHeight() {
        var header = $("header");
        var footer = $(".foot");
        var calcedMargin = $(window).innerHeight() -getEntireHeight(header) - getEntireHeight(footer) - $(".layout").innerHeight();
        $(".layout").css({
            'margin-bottom': Math.max(0, calcedMargin / 2-1),
            'margin-top': Math.max(0, calcedMargin / 2-1)
        });
    }
}