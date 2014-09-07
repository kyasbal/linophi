class NikoScreenMover
{
    loaded: collections.Set<string> = new collections.Set<string>();
    
    public onLoad(str: string):void
    {
        if (this.loaded.contains(str))
        {
            this.loaded.remove(str);
            window.open("http://www.nicovideo.jp/watch/" + str);
            $(".x_movie-id-" + str).each((i, e) =>
            {
                updateInner(e, str);
            });
        } else
        {
            this.loaded.add(str);
        }
    }    
}

interface Element
{
    innerHTML:string;
}

var nicoMover: NikoScreenMover=new NikoScreenMover();
$(() =>
{
    $(".x_youtube-box").each((i, e) =>
    {
        var classNames = ((Object)(e)).className;
        var movieId = classNames.replace(/.*x_movie-id-([\w-]+).*/, "$1");
        e.innerHTML = "<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/" + movieId + "\" frameborder=\"0\" allowfullscreen></iframe>";
    });
    $(".x_niko-box").each((i, e) =>
    {
        var classNames = ((Object)(e)).className;
        var movieId = classNames.replace(/.*x_movie-id-(\w+).*/, "$1");
        updateInner(e, movieId);
    });
});

function updateInner(e:Element,movieId:string)
{
    e.innerHTML = "<iframe onload=\"nicoMover.onLoad('"+movieId+"');\" width=\"560px\" height=\"315px\" src=\"/Content/Nico?id=" + movieId + "\" scrolling=\"no\" frameborder=\"0\"></iframe>";
}