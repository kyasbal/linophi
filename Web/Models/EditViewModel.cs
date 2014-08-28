using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Storage;

namespace Web.Models
{
    public class EditViewModel
    {
        public string Title { get; set; }

        public string Tag { get; set; }

        public string Context { get; set; }
    }

    public class ContextDataModel
    {
        public ICollection<ParagraphDataModel> Paragraphs { get; set; }
    }

    public class ParagraphDataModel
    {
        public string prevParagraph { get; set; }

        public string nextParagraph { get; set; }

        public string rawText { get; set; }

        public string id { get; set; }

        public int paragraphIndex { get; set; }

        public static ParagraphDataModel GetFromStorage(ParagraphEntity paragraphEntity)
        {
            return new ParagraphDataModel()
            {
                id = paragraphEntity.RowKey,
                nextParagraph = paragraphEntity.NextParagraph,
                prevParagraph = paragraphEntity.PrevParagraph,
                paragraphIndex = paragraphEntity.ParagraphIndex,
                rawText = paragraphEntity.RawText
            };
        }
    }
}