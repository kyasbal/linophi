using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;
using Web.Storage;

namespace Web.Api.Response.Article
{
    public class ArticleSummaryResponse
    {
        public ArticleSummaryResponse(ArticleModel model,LabelTableManager ltm)
        {
            this.Title = model.Title;
            this.LabelCount = model.LabelCount;
            this.LabelInfo = ltm.GetLabelsJson(model.ArticleModelId);
        }

        public string Title { get; set; }

        public int LabelCount { get; set; }

        public string LabelInfo { get; set; }
    }
}