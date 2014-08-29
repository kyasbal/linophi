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
        private bool isTitleExist(string title)
        {
            ApplicationDbContext context = new ApplicationDbContext();
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
            return Json(new ExistenceResponse(isTitleExist(articleName)));
        }

        public IHttpActionResult IsValidTitle([FromBody]VerifyTitleRequest req)
        {
            if (req.Title == null) return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。"));
            string articleName = req.Title.Replace(" ", "").Replace("　", "");
            if (articleName.Length <= 50)
            {
                if (articleName.Length >= 5)
                {
                    if (string.IsNullOrWhiteSpace(articleName))
                    {
                        return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。"));
                    }
                    else
                    {
                        if (isTitleExist(req.Title))
                        {
                            return Json(VerifyTitleResponse.GenerateFailedResponse("そのタイトルはすでに利用されています。"));
                        }
                        else
                        {
                            return Json(VerifyTitleResponse.GenerateSuccessResponse());
                        }
                    }
                }
                else
                {
                    return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルが短すぎます。"));
                }
            }
            else
            {
                return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルが長すぎます。"));
            }
        }
    }
}
 