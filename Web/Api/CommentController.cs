using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Web.Storage;
using Web.Storage.Connection;

namespace Web.Api
{
    public class CommentController : ApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> AttachComment(AttachCommentRequest req)
        {
            ArticleCommentTableManager commentTableManager=new ArticleCommentTableManager(new TableStorageConnection());
            await commentTableManager.AddComment(new ArticleComment(req.ArticleId, req.ParagraphId, req.UserName,
                HttpContext.Current.Request.UserHostAddress, req.Comment));
            return Json(true);
        }
    }
}
