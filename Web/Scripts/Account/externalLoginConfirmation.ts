var confirmation: ExternalLoginConfirmationPage;
$(() =>
{
    confirmation = new ExternalLoginConfirmationPage();
});
class ExternalLoginConfirmationPage
{
    constructor()
    {
        $("#nickname").keyup(() => this.changed());
        $("#year").change(() => this.changed());
        $("#month").change(() => this.changed());
        $("#day").change(() => this.changed());
        $("#gender").change(() => this.changed());
        $("#agreeWithTerm").change(() => this.changed());
        $("#mail").keyup(() => this.changed());
        this.changed();
    }

    private _errFlag=false;

    generatePassageWithClass(errText:string,className:string): JQuery
    {
        return $('<p class="'+className+'">' + errText + '</p>');
    }

    applyError(target:JQuery,errText:string): void
    {
        target.after(this.generatePassageWithClass(errText,"errTxt"));
        this._errFlag = true;//エラーということにする
    }

    applySuccess(target: JQuery, errText: string): void {
        target.after(this.generatePassageWithClass(errText,"success"));
    }

    changed()
    {
        var errorCount: number = 5;
        $(".errTxt").remove();
        $(".success").remove();
        this._errFlag = false;
        var nickName = $("#nickname").val();
        if (nickName.length >= 12)
        {
            this.applyError($("#nickname"), "長すぎます。");
            
        } else if (nickName.length <= 2)
        {
            this.applyError($("#nickname"), "短すぎます。");
        } else
        {
            this.applySuccess($("#nickname"), "OK");
            errorCount--;
        }
        var year:number = $("#year").val();
        var month:number = $("#month").val();
        var day:number = $("#day").val();
        if (year*month*day!=0)
        {
            this.applySuccess($(".confirmation-form-birthday-container"), "OK");
            errorCount--;
        } else
        {
            this.applyError($(".confirmation-form-birthday-container"), "何かおかしいです。");
        }
        var gender: number = $("#gender").val();
        if (gender != 0)
        {
            this.applySuccess($("#gender"), "OK");
            errorCount--;
        } else
        {
            this.applyError($("#gender"), "性別を入力してください。");
        }
        if ($("#agreeWithTerm").prop("checked"))
        {
            errorCount--;
        } else
        {
            this._errFlag = true;
        }
        var mailAddr: string = $("#mail").val();
        if (mailAddr.match(/^[A-Za-z0-9][\w-\.]+@[A-Za-z0-9][\w-]+\.[A-Za-z0-9\.]+[A-Za-z0-9]+$/)&&mailAddr.indexOf("..")==-1)
        {
            errorCount--;
            this.applySuccess($("#mail"), "OK");
        } else
        {
            this.applyError($("#mail"), "正しいメールアドレスを入力してください。");
        }

        if (this._errFlag)
        {
            $("#submitBtn").attr("disabled", "disabled");
        } else
        {
            $("#submitBtn").removeAttr("disabled");
        }
        $(".color-bar").css("width", (5 - errorCount) * 20 + "%");
    }
}

//$(() => {
//    var err_check: number = 0;
//    $("#nickname").keyup(() => {
//        var Name: string = $("#nickname").val();
//        err_check += changeVisibleLengthErr(name.length > 10);
//        err_check += changeVisibleCharErr(Name);
//    });
//    $("#SignUp").click(() => {
//        var Name: string = $("#nickname").val();
//        var Year: string = $("#year").val();
//        var Month: string = $("#month").val();
//        var Day: string = $("#day").val();
//        var MailAddr: string = $("#mail").val();
//        var Checkbox: boolean = $("#agreeWithTerm").val()=="true";
//        err_check += name_check(Name);
//        err_check += birthday_check(Year, Month, Day);
//        err_check += mail_check(MailAddr);
//        err_check += checkbox_check(Checkbox);
//        updateSubmitState(err_check);
//    });
//
//});
//
//function updateSubmitState(num :number) {
//    var isOK: boolean = num == 0;
//    if (isOK) {
//        $("#submitBtn").attr("disabled", "false");
//    } else {
//        $("#submitBtn").attr("disabled", "true");
//    }
//}
//
//function changeVisibleLengthErr(visibility: boolean): number{
//    if (visibility) {
//        $(".nickname-length-err").removeClass("err");
//        $(".nickname-length-err").addClass("err-visible");
//        return 1;
//    } else {
//        $(".nickname-length-err").removeClass("err-visible");
//        $(".nickname-length-err").addClass("err");
//        return 0;
//    }
//}
//
//function changeVisibleCharErr(check: string): number {
//    var invalidChars: string[] = ["|", "<", ">", "$", "｢", "｣", ":", ";", "*", "・", "｡", "､", "･", "ﾞ", "ﾟ", ".", "&", "=", "`", "'", "!", "?",",","\""," ","　"];
//    var input: boolean = true;
//    var cachedText: string = "";
//    for (var i = 0; i < invalidChars.length; i++) {
//        if (check.indexOf(invalidChars[i]) != -1) {
//            input = false;
//            cachedText+=("「" + invalidChars[i] + "」、");
//        }
//    }
//    if (!input) {
//            $(".nickname-char-err").removeClass("err");
//        $(".nickname-char-err").addClass("err-visible");
//        cachedText = cachedText.substr(0, cachedText.length - 1);
//        cachedText = cachedText.replace(" ", "スペース");
//        cachedText = cachedText.replace("　", "スペース");
//        $(".nickname-char-err").text(cachedText + "は使用できません。");
//        return 1;
//    } else {
//        $(".nickname-char-err").removeClass("err-visible");
//        $(".nickname-char-err").addClass("err");
//        return 0;
//    }
//}
//
//function birthday_check(str1: string, str2: string, str3: string): number{
//    if (str1.indexOf("----") != -1 || str2.indexOf("--") != -1 || str3.indexOf("--") != -1) {
//        $(".birthday-select-err").removeClass("err");
//        $(".birthday-select-err").addClass("err-visible");
//        $(".birthday-border").addClass("blank");
//        return 1;
//    } else {
//        $(".birthday-select-err").removeClass("err-visible");
//        $(".birthday-select-err").addClass("err"); 
//        return 0;
//    }
//}
//
//function name_check(str: string): number {
//    if (!str) {
//        $(".name-blank").removeClass("err");
//        $(".name-blank").addClass("err-visible");
//        $(".name-border").addClass("blank");
//        return 1;
//    } else {
//        $(".name-blank").removeClass("err-visible");
//        $(".name-blank").addClass("err");
//        return 0;
//    }
//}
//
//function mail_check(str: string): number {
//    if (!str) {
//        $(".mail-blank").removeClass("err");
//        $(".mail-blank").addClass("err-visible");
//        $(".mail-border").addClass("blank");
//        return 1;
//    } else {
//        $(".mail-blank").removeClass("err-visible");
//        $(".mail-blank").addClass("err");
//        return 0;
//    }
//}
//
//function checkbox_check(bool: boolean): number {
//    if (!bool) {
//        $(".checkbox-blank").removeClass("err");
//        $(".checkbox-blank").addClass("err-visible");
//        return 1;
//    } else {
//        $(".checkbox-blank").removeClass("err-visible");
//        $(".checkbox-blank").addClass("err");
//        return 0;
//    }
//}