var SearchOrderOptionBox = (function () {
    function SearchOrderOptionBox(targetoptioncontrol, targetPath, searchedAttribute) {
        this.targetElement = targetoptioncontrol;
        this.targetPath = targetPath;
        this.searchedAttribute = searchedAttribute;
    }
    SearchOrderOptionBox.prototype.onOptionChange = function () {
        window.location.href = "/" + this.targetPath + "?" + this.searchedAttribute + "=" + $("#searchedText").val() + "&order=" + this.targetElement.val() + "&skip=" + $("#skip").val();
    };

    SearchOrderOptionBox.prototype.initBoxSelected = function () {
        this.targetElement.val($("#order").val());
    };
    return SearchOrderOptionBox;
})();
//# sourceMappingURL=SearchOrderOptionBox.js.map
