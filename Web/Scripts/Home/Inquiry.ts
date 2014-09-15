interface JQuery
{
    validate(arg:any):void;
}

$(() =>
{
    $(".submit-inquiry").click(() =>
    {
        $(".inquiry-form").submit();
    });
    InquiryPage.adjustHeight();
    $(window).resize(() => { InquiryPage.adjustHeight(); });

    $("#myform").validate({
        rules: {
            Name: {
                required: true
            },
            Mail: {
                required: true,
                email: true
            },
            Content: {
                required: true,
                minlength: 10
            }
        },
        messages: {
            Name: {
                required: "お名前を入力してください"
            },
            Mail: {
                required: "メールアドレスを入力してください",
                email: "正しいメールアドレスを入力してください"
            },
            Content: {
                required: "内容を入力してください",
                minlength: "10文字以上入力してください"
            }
        },
        errorElement: "div",
    });
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
