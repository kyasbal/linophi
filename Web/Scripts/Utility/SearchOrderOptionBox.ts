class SearchOrderOptionBox
{
    private targetElement: JQuery;

    private targetPath: string;

    private searchedAttribute:string;

    constructor(targetoptioncontrol: JQuery, targetPath: string,searchedAttribute:string)
     {
        this.targetElement = targetoptioncontrol;
        this.targetPath = targetPath;
         this.searchedAttribute = searchedAttribute;
     }

    onOptionChange()
    {
        window.location.href = "/"+this.targetPath+"?"+this.searchedAttribute+"="+$("#searchedText").val()+"&order="+this.targetElement.val()+"&skip="+$("#skip").val();
    }

    initBoxSelected()
    {
        this.targetElement.val($("#order").val());
    }
 }