using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Web.Storage;
using Web.Storage.Connection;

namespace Web.Api.Label
{
    public class LabelController : ApiController
    {
        public IHttpActionResult AttachLabel(AttachLabelRequestModel req)
        {
            LabelTableManager ltb=new LabelTableManager(new TableStorageConnection());
            bool isSucceed=ltb.IncrementLabel(req.ArticleId, req.ParagraphId, HttpContext.Current.Request.UserHostAddress,req.LabelType);
            return Json(new {isSucceed = isSucceed});
        }
    }

    public class AttachLabelRequestModel
    {
        public string ArticleId { get; set; }

        public string ParagraphId { get; set; }

        public string LabelType { get; set; }
    }
}
