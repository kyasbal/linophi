module NovelEditer
{
    export class ParagraphFactory
    {
        private _manager;
        constructor()
        {
            this._manager = new ParagraphManager();
        }
        createParagraph(json: string): Paragraph
        {
            var ret = new Paragraph(this._manager, "");
            ret.fromJSON(json);
            return ret;
        }

        rebuildParagraphs(json: string): Paragraph
        {
            var firstParagraph, cacheParagraph;
            firstParagraph=cacheParagraph= new Paragraph(this._manager, "");
            var jsonObjects = JSON.parse(json);
            for (var i = 0; i < jsonObjects.length; i++)
            {
                cacheParagraph.fromJSON(jsonObjects[i]);
                cacheParagraph = new Paragraph(this._manager, "");
            }
            return firstParagraph;
        }
    }
}