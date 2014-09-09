var top_height;
var wholeCount;
var articleDoughnut;
$(() =>
{
    //記事全体の感情状態の表示
    wholeCount=labelSourceParser.countWholeEmotions();
    updateArticleDounught(true);
});

function updateArticleDounught(isCreation:boolean=false)
{
    var doughnutData = [
        {
            value: wholeCount.surprised,
            color: "#F66497",
            label: "ビックリ"
        },
        {
            value: wholeCount.anger,
            color: "#CD3B3B",
            label: "怒る"
        },
        {
            value: wholeCount.fun,
            color: "#FFB33A",
            label: "面白い"
        },
        {
            value: wholeCount.bethink,
            color: "#E9EC00",
            label: "なるほど"
        },
        {
            value: wholeCount.good,
            color: "#A1E73E",
            label: "いいね"
        },
        {
            value: wholeCount.sad,
            color: "#81C8FF",
            label: "悲しい"
        },
        {
            value: wholeCount.noidea,
            color: "#6B53FF",
            label: "わからない"
        }
    ];
    if(isCreation)
    articleDoughnut = new Chart(document.getElementById("article-graph").getContext("2d")).Doughnut(doughnutData, {
        animateScale: true
    });
    else
    {
        for (var i = 0; i < doughnutData.length;i++)
        {
            articleDoughnut.segments[i].value = doughnutData[i].value;
        }
        articleDoughnut.update();
    }
}
$(function ()
 {
     top_height = $('.top').height();
});

if(top_height>=200)
{
    $(function()
    {
        $('.navbar-thumb').css('margin-bottom', '100px');
    });
};