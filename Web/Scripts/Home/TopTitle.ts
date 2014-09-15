$(() =>
{
    for (var i = 1; i <= 3; i++)
    {
        $('.top-header > h1 > span:nth-child(' + (i + 1) + ')') // 1番目は「み」ではなくて「.」だから
            .addClass(
                "font-" + String((Math.random()*46 + 1)|0)
            );
    }
})