using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
    }
}