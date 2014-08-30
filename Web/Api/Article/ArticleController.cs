using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc.Html;
using Newtonsoft.Json;
using Web.Api.Response;
using Web.Api.Response.Article;
using Web.Models;

namespace Web
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
        
        public IHttpActionResult IsExist([FromBody]ExistenceRequest req)
        {
            string articleName = req.Title;
            return Json(new ExistenceResponse(isTitleExist(articleName,Request.GetOwinContext().Get<ApplicationDbContext>())));
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

        public IHttpActionResult IsValidTitle([FromBody]VerifyTitleRequest req)
        {
            return Json(IsValidTitle(req.Title));
        }
    }
}
 