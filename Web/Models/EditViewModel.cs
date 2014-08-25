using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class EditViewModel
    {
        public string title { get; set; }

        public ParagraphViewModel[] parapraphs { get; set; }
    }

    public class ParagraphViewModel
    {
        public string prevParagraph { get; set; }

        public string nextParagraph { get; set; }

        public string rawText { get; set; }

        public string id { get; set; }

        public int paragraphIndex { get; set; }
    }
}