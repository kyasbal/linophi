using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.UI.WebControls;
using Microsoft.AspNet.Identity.Owin;
using Web.Api.Response.Article;
using Web.Models;

namespace Web.Api.Article
{
    public class ArticleController : ApiController
    {
        private static bool isTitleExist(string title,ApplicationDbContext context)
        {
            if (context.Articles.Any((a) => a.Title.Equals(title)))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        [Authorize]
        public IHttpActionResult IsExist([FromBody]ExistenceRequest req)
        {
            string articleName = req.Title;
            return Json(new ExistenceResponse(isTitleExist(articleName, HttpContext.Current.GetOwinContext().Get<ApplicationDbContext>())));
        }

        public static VerifyTitleResponse IsValidTitle(string title,ApplicationDbContext context)
        {
            if (title == null) return VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。");
            string articleName = title.Replace(" ", "").Replace("　", "");
            if (articleName.Length <= 50)
            {
                if (articleName.Length >= 5)
                {
                    if (string.IsNullOrWhiteSpace(articleName))
                    {
                        return VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。");
                    }
                    else
                    {
                        if (isTitleExist(title,context))
                        {
                            return VerifyTitleResponse.GenerateFailedResponse("そのタイトルはすでに利用されています。");
                        }
                        else
                        {
                            return VerifyTitleResponse.GenerateSuccessResponse();
                        }
                    }
                }
                else
                {
                    return VerifyTitleResponse.GenerateFailedResponse("タイトルが短すぎます。");
                }
            }
            else
            {
                return VerifyTitleResponse.GenerateFailedResponse("タイトルが長すぎます。");
            }
        }
        [Authorize]
        public IHttpActionResult IsValidTitle([FromBody]VerifyTitleRequest req)
        {
            if (req == null) return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。"));
            return Json(IsValidTitle(req.Title, HttpContext.Current.GetOwinContext().Get<ApplicationDbContext>()));
        }
    }
}
 