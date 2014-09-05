var NikoScreenMover = (function () {
    function NikoScreenMover() {
        this.loaded = new collections.Set();
    }
    NikoScreenMover.prototype.onLoad = function (str) {
        if (this.loaded.contains(str)) {
            this.loaded.remove(str);
            window.open("http://www.nicovideo.jp/watch/" + str);
            $(".x_movie-id-" + str).each(function (i, e) {
                updateInner(e, str);
            });
        } else {
            this.loaded.add(str);
        }
    };
    return NikoScreenMover;
})();

var nicoMover = new NikoScreenMover();
$(function () {
    $(".x_youtube-box").each(function (i, e) {
        var classNames = ((Object)(e)).className;
        var movieId = classNames.replace(/.*x_movie-id-(\w+).*/, "$1");
        e.innerHTML = "<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/" + movieId + "\" frameborder=\"0\" allowfullscreen></iframe>";
    });
    $(".x_niko-box").each(function (i, e) {
        var classNames = ((Object)(e)).className;
        var movieId = classNames.replace(/.*x_movie-id-(\w+).*/, "$1");
        updateInner(e, movieId);
    });
});

function updateInner(e, movieId) {
    e.innerHTML = "<iframe onload=\"nicoMover.onLoad('" + movieId + "');\" width=\"560px\" height=\"315px\" src=\"/Content/Nico?id=" + movieId + "\" scrolling=\"no\" frameborder=\"0\"></iframe>";
}
//# sourceMappingURL=MovieFixation.js.map
