using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.WindowsAzure.ServiceRuntime;
using Web.Api.Response.Article;
using Web.Models;
using Web.Storage;
using Web.Storage.Connection;

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
        [System.Web.Http.Authorize]
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
        [System.Web.Http.Authorize]
        public IHttpActionResult IsValidTitle([FromBody]VerifyTitleRequest req)
        {
            if (req == null) return Json(VerifyTitleResponse.GenerateFailedResponse("タイトルは空白にできません。"));
            return Json(IsValidTitle(req.Title, HttpContext.Current.GetOwinContext().Get<ApplicationDbContext>()));
        }

        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetRandomArticle()
        {
            const int minimumLabelCount = 10;
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            IQueryable<ArticleModel> articleModels = context.Articles.Where(f => !f.IsDraft && f.LabelCount > minimumLabelCount);
            LabelTableManager ltm = new LabelTableManager(new TableStorageConnection());
            int count = await articleModels.CountAsync();
            Random r=new Random();
            int index = r.Next(count);
            articleModels = articleModels.OrderBy(f => f.LabelCount).Skip(index).Take(1);
            return Json(new ArticleSummaryResponse(await articleModels.FirstOrDefaultAsync(), ltm));
        }

        [System.Web.Http.HttpPost]
        [ValidateAntiForgeryToken]
        [System.Web.Http.Authorize(Roles = "Administrator")]
        public async Task<IHttpActionResult> RemoveAllLabel(AdministratorArticleRequest req)
        {
            LabelTableManager ltm=new LabelTableManager(new TableStorageConnection());
            await ltm.RemoveArticleLabelAsync(req.ArticleId);
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleModel article = await context.Articles.FindAsync(req.ArticleId);
            article.LabelCount = 0;
            await context.SaveChangesAsync();
            return Json(true);
        }
        [System.Web.Http.HttpPost]
        [ValidateAntiForgeryToken]
        [System.Web.Http.Authorize(Roles = "Administrator")]
        public async Task<IHttpActionResult> RemoveArticle(AdministratorArticleRequest req)
        {
            //DB上の削除
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleModel article = await context.Articles.FindAsync(req.ArticleId);
            context.Articles.Remove(article);
            await context.SaveChangesAsync();
            //記事の本文の削除
            BlobStorageConnection bConnection=new BlobStorageConnection();
            TableStorageConnection tConnection=new TableStorageConnection();
            ArticleThumbnailManager thumbnailManager=new ArticleThumbnailManager(bConnection);
            ArticleBodyTableManager abtm=new ArticleBodyTableManager(bConnection);
            ArticleMarkupTableManager amtm=new ArticleMarkupTableManager(bConnection);
            LabelTableManager labelManager=new LabelTableManager(tConnection);
            ArticleCommentTableManager commentManager=new ArticleCommentTableManager(tConnection);
            await thumbnailManager.RemoveThumbnail(req.ArticleId);
            await abtm.RemoveArticle(req.ArticleId);
            await amtm.RemoveArticle(req.ArticleId);
            await labelManager.RemoveArticleLabelAsync(req.ArticleId);
            await commentManager.RemoveCommentsAsync(req.ArticleId);
            return Json(true);
        }

    public class AdministratorArticleRequest
        {
            public string ArticleId { get; set; }
        }
    }
}
 