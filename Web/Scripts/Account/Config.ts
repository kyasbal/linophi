var name: string;
var length: number;

$(() =>
{
    $(window).resize(() => { LoginPage.adjustHeight(); });
    ConfigPage.adjustHeight();
    $(".config-submit").click(() =>
    {
        $(".config-form").submit();
    });

    $(".name").keyup(function ()
    {
        name = $(this).val();
        length = name.length;
        if (length < 2)
        {
            $(".config-submit").css('display', 'none');
            $(".error-message").css('opacity', 1);
        }
        else if (length > 15)
        {
            $(".config-submit").css('display', 'none');
            $(".error-message").css('opacity', 1);
        }
        else
        {
            $(".config-submit").css('display', 'inline');
            $(".error-message").css('opacity', 0);
        }
    });
});

module ConfigPage
{
    export function getEntireHeight($elem: JQuery): number
    {
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