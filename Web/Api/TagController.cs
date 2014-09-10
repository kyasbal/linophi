using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
namespace Web.Api
{
    public class TagController : ApiController
    {
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetTagCount([FromBody]GetTagCountRequest req)
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleTagModel tag = context.Tags.Where(f => f.TagName.Equals(req.Tag)).FirstOrDefault();
            if (tag == null) return Json(new GetTagCountResult() {TagCount = 0});//タグが存在しないとき
            await context.Entry(tag).Collection(f => f.Articles).LoadAsync();
            var count = tag.Articles.Count;
            return Json(new GetTagCountResult() {TagCount = count});
        }

        public class GetTagCountRequest
        {
            /// <summary>
            /// タグ名
            /// </summary>
            public string Tag { get; set; }
        }

        public class GetTagCountResult
        {
            public int TagCount { get; set; }
        }
    }
}
