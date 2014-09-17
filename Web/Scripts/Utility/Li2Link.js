$(function () {
    $("li, .listitem").click(function () {
        if ($(this).find("a").attr("href")) {
            location.href = $(this).find("a").attr("href");
        }
    });
});
//# sourceMappingURL=Li2Link.js.map
