$.fn.caret = function (begin, end) {
    return {begin:$(this).prop("selectionStart"),end:$(this).prop("selectionEnd")};
}