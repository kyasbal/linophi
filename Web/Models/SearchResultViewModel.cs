using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class SearchResultViewModel
    {
        public SearchResultArticle[] Articles { get; set; }
        public string SearchResultText { get; set; }
    }

    public class SearchResultArticle
    {
        public string Title { get; set; }

        public int PageView { get; set; }

        public int LabelCount { get; set; }

        public string ArticleId { get; set; }
    }
}