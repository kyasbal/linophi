using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Api
{
    public class AttachCommentRequest
    {
        public string ArticleId { get;set; }

        public string UserName { get; set; }
        public string ParagraphId { get;set; }

        public string Comment { get; set; }
    }
}