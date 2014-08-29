function updateSize()
{
    //class edit-textの高さを取得して、変数に代入
    var txtH = $('.edit-text').height();
    //class edit-previewの高さを取得を取得して、変数に代入
    var prevH = $('div.edit-preview').height();
    // ボックス要素より画面サイズがおなじでなければ実行
    if (txtH != prevH) {
        $('div.edit-preview').height(txtH);
    }
}

var isFocus = false;
$(function ()
{
    $('.edit-text').mouseover(function ()
    {
        isFocus = true;
    });
    $(document).mouseup(function ()
    {
        isFocus = false;
    });
    $(document).mousemove(function ()
    {
        if(isFocus)updateSize();
    });

    
    updateSize();
});

$(function next_text(idx)
{
    if (window.event.keyCode == 13)
    { // 13は0x0d(CRキー)
        // 次のテキストボックスへ飛ばす処理をここにかく
        document.mainFormedit[idx].focus();
        return false;
    }
    return true;
});


