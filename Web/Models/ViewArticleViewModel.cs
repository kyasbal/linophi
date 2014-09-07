using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Models
{
    /// <summary>
    /// JSONにするためのViewModel
    /// </summary>
    public class ViewArticleViewModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int PageView { get; set; }
        public string Author { get; set; }
        public string Author_ID { get; set; }
        public string LabelInfo { get; set; }

        public string Article_Date{get; set;}
        public string Article_UpDate { get; set; }

        public IEnumerable<TagViewModel> Tags { get; set; }
        public MvcHtmlString Author_IconTag { get; set; }
        public int LabelCount { get; set; }
        public bool UseThumbnail { get; set; }
        public string ArticleId { get; set; }
        public string CommentInfo { get; set; }
    }

    public class TagViewModel
    {
        public string TagId { get; set; }

        public string TagName { get; set; }

        public int ArticleCount { get; set; }
    }

}