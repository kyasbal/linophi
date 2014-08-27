using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    /// <summary>
    /// JSONにするためのViewModel
    /// </summary>
    public class ViewArticleViewModel
    {

        public string Content { get; set; }
    }

    /// <summary>
    /// ViewArticleViewModelのContentのJsonの構造
    /// </summary>
    public class ViewArticleContentStructure
    {
        public string ArticleTitle { get; set; }

        public ArticleTagModel[] Tags { get; set; }

        public ParagraphDataModel[] Paragraphs { get; set; }

        public string UpdateTime { get; set; }
    }
}