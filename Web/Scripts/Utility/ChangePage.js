var ChangePage = (function () {
    function ChangePage(targetoptioncontrol, targetPath, searchedAttribute, needSearchText) {
        if (typeof needSearchText === "undefined") { needSearchText = true; }
        this.targetElement = targetoptioncontrol;
        this.targetPath = targetPath;
        this.searchedAttribute = searchedAttribute;
        this.needSearchText = needSearchText;
    }
    ChangePage.prototype.onOptionChange = function () {
        var addr = "/" + this.targetPath + "?";
        if (this.needSearchText) {
            addr += this.searchedAttribute + "=" + $("#searchedText").val() + "&";
        }
        addr += "order=" + this.targetElement.val() + "&skip=" + $("#skip").val();
        window.location.href = addr;
    };

    ChangePage.prototype.initBoxSelected = function () {
        this.targetElement.val($("#order").val());
    };
    return ChangePage;
})();
//# sourceMappingURL=ChangePage.js.map
