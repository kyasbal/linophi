$(() =>
{
    $(window).resize(() => { LoginPage.adjustHeight(); });
    LoginPage.adjustHeight();
});

module LoginPage
{
    export function getEntireHeight($elem:JQuery):number
    {
        return $elem.outerHeight(true);
    }

     export function adjustHeight(): void
     {
         var header = $("header");
         var footer = $(".foot");
         var calcedMargin = $(window).innerHeight() - LoginPage.getEntireHeight(header) - LoginPage.getEntireHeight(footer)-$(".layout").innerHeight();
         $(".layout").css({
             'margin-bottom': Math.max(0,calcedMargin/2),
             'margin-top': Math.max(0, calcedMargin / 2)
         });
     }
}