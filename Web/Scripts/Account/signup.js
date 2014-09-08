var name;
var len;

$(function () {
    $(".name-box").focusout(function () {
        name = $(this).val();
        alert(name);
        len = name.length;
        if (len <= 3) {
            $(".warn2").css("display", "inline");
        } else {
            $(".warn2").css("display", "none");
        }
        if (len > 10) {
            $(".warn1").css("display", "inline");
        } else {
            $(".warn1").css("display", "none");
        }
    });
});

var add;
$(function () {
    $(".email-box").focusout(function () {
        add = $(this).val();
        if (add.match(/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/g)) {
            $(".warn3").css("display", "none");
        } else {
            $(".warn3").css("display", "inline");
        }
    });
});
//# sourceMappingURL=signup.js.map
