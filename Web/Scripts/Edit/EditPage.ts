/// <reference path="../typings/jquery/jquery.d.ts" />
var editPage: EditPage;
var editorInstance: NovelEditer.NovelEditer;
var isConfirmedTitle: boolean;
isConfirmedTitle = false;
$(() => {
    editPage = new EditPage();
    editorInstance = new NovelEditer.NovelEditer($(".edit-context"), $(".preview-body"), $(".preview-context"));
    editorInstance.saveInput();

        editorInstance.updateToshow();
    editPage.onChanged();
    $(".edit-submit-button").click(() => {
        var tagList: string[] = new Array();
        tags.forEach((item) =>
        {
            tagList.push(item);
            return true;
        });
        $("#hidden-tag").val(JSON.stringify(tagList));
        $('.edit-preview > *').removeClass("em");
        $("#hidden-body").val($(".preview-body").html());
        $("#hidden-markup").val($(".edit-context").val());
        if (isConfirmedTitle) $(".edit-form").submit();
    });

});


function selectEditBody() {
    editPage.CurrentPage = EditPageContents.EditBody;
}

function selectConfigure()
{
    editPage.CurrentPage = EditPageContents.Configure;
}

function selectEditBelt() {
    editPage.CurrentPage = EditPageContents.EditBelt;
}

class EditPage {

   asp: AspectRatioStrecher = new AspectRatioStrecher(1.44969, $(".preview-container"), false);
    private currentPage: EditPageContents;

    public get CurrentPage() {
        return this.currentPage;
    }

    public set CurrentPage(val: EditPageContents) {
        this.currentPage = val;
        this.OnCurrentPageChanged();
    }

    private OnCurrentPageChanged(): void {
        switch (this.CurrentPage) {
            case EditPageContents.EditBody:
                $(".editor-tab-container ul li").removeClass("selected");
                $(".tab-item-editbody").addClass("selected");
            break;
            case EditPageContents.Configure:
                $(".editor-tab-container ul li").removeClass("selected");
                $(".tab-item-configure").addClass("selected");
            break;
            case EditPageContents.EditBelt:
                $(".editor-tab-container ul li").removeClass("selected");
                $(".tab-item-editbelt").addClass("selected");
            break;
            default:
        }
    }
    constructor() {
        this.CurrentPage = EditPageContents.EditBody;
        var st:HeightStretcher = new HeightStretcher($(".editor-content-bg"), $(".editor-bg-overlay"));
        st.addSubElement($("header"));
        st.addSubElement($(".editor-footer"));
        st.updateTargetProperty();
        var st2: HeightStretcher = new HeightStretcher($(".novel-editor-container-inner"), $(".novel-editor-container-outer"));
        st2.addSubElement($(".body-editor-header .half-divider"));
        st2.updateTargetProperty();
        $(".editor-submit-button").click(() => { this.submit(); });
    }

    onChanged() {
        $(".editor-submit-button").addClass(".editor-submit-button-enabled");
    }

    submit() {
        $(".editor-submit-button").removeClass(".editor-submit-button-enabled");
    }

}

enum EditPageContents {
    EditBody,Configure,EditBelt
}

var editmode: string = $('#hidden-mode[name="Mode"]').val();
if ("edit"==editmode)
{
    $(".edit-submit-button").css('background-color', '#7FFFD4');
    $(".edit-submit-button").hover(function () {
        $(this).css("background-color", "#3CB371");
    }, function () {
            $(this).css("background-color", "#7FFFD4");
        });
}