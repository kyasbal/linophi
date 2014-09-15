using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Storage;

namespace Web.Models
{
    public class EditViewModel
    {
        public string Title { get; set; }

        public string Tag { get; set; }

        [AllowHtml]
        public string Markup { get; set; }

        [AllowHtml]
        public string Body { get; set; }

        public string Mode { get; set; }

        public string Id { get; set; }

        public string TopicId { get; set; }

        public HttpPostedFileBase Thumbnail { get; set; }

        public string RelatedArticle { get; set; }
    }
}