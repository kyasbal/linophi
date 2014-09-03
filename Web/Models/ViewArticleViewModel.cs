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
        public string Title { get; set; }
        public string Content { get; set; }
        public int PageView { get; set; }
        public string Author { get; set; }
        public string Author_ID { get; set; }
        public string LabelInfo { get; set; }

        public IEnumerable<TagViewModel> Tags { get; set; }
    }

    public class TagViewModel
    {
        public string TagId { get; set; }

        public string TagName { get; set; }

        public int ArticleCount { get; set; }
    }

}