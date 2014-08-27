$(function()
{
    var prevM = $('.edit-preview').margin-left();
    var titleM = $('.edit-title').margin-left();
    var tagM = $('.edit-tag').margin-left();

    if (prevM != titleM)
    {
        $('.edit-title').margin-left(prevM);
    }
    if (prevM != tagM) {
        $('.edit-tag').margin-left(prevM);
    }
});

