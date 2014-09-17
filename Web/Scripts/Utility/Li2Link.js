$(function () {
    $("li, .listitem").click(function () {
        location.href = $(this).find("a").attr("href");
    });
});
//# sourceMappingURL=Li2Link.js.map
