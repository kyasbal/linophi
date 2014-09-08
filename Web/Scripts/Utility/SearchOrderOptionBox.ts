class SearchOrderOptionBox
{
    private targetElement: JQuery;

    private targetPath: string;

    private searchedAttribute: string;

    private needSearchText:boolean;

    constructor(targetoptioncontrol: JQuery, targetPath: string,searchedAttribute:string,needSearchText:boolean=true)
     {
        this.targetElement = targetoptioncontrol;
        this.targetPath = targetPath;
        this.searchedAttribute = searchedAttribute;
         this.needSearchText = needSearchText;
     }

    onOptionChange()
    {
        var addr: string = "/" + this.targetPath + "?";
        if (this.needSearchText)
        {
            addr += this.searchedAttribute + "=" + $("#searchedText").val()+"&";
        }
        addr += "order=" + this.targetElement.val() + "&skip=" + $("#skip").val();
        window.location.href = addr;
    }

    initBoxSelected()
    {
        this.targetElement.val($("#order").val());
    }
 }