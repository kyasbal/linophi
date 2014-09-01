$('.menu').on({
    click: function (e) {
        e.preventDefault();

        var cls = $(".dropdown-menu").attr("class");

        if (cls.match(/open/)) {
            $(".dropdown-menu").removeClass("open");
        } else {
            $(".dropdown-menu").addClass("open");
        }
    }
});
//# sourceMappingURL=head.js.map
