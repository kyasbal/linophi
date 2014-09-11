$(() =>
{
    $(window).resize(() => { LoginPage.adjustHeight(); });
    ConfigPage.adjustHeight();
    $(".config-submit").click(() =>
    {
        $(".config-form").submit();
    });
});

module ConfigPage
{
    export function getEntireHeight($elem: JQuery): number {
        return $elem.outerHeight(true);
    }

    export function adjustHeight()
    {
        var header = $("header");
        var footer = $(".foot");
        var calcedMargin = $(window).innerHeight() - getEntireHeight(header) - getEntireHeight(footer) - $(".layout").innerHeight();
        $(".layout").css({
            'margin-bottom': Math.max(0, calcedMargin / 2),
            'margin-top': Math.max(0, calcedMargin / 2)
        });
    }
}