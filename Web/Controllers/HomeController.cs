
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.Storage;
using Web.Storage.Connection;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        private async Task<ViewArticleViewModel> getArticleViewModel(string articleId)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            var article = context.Articles.FirstOrDefault(a => a.ArticleId.Equals(articleId));
            if (article == null) return null;
            ArticleBodyTableManager manager=new ArticleBodyTableManager(new BlobStorageConnection());
            var author=await HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(article.AuthorID);
            article.PageView++;
            context.SaveChanges();
            return new ViewArticleViewModel()
            {
                Author=author.NickName,
                Author_ID=author.UniqueId,
                PageView=article.PageView,
                Title = article.Title,
                Content =await manager.GetArticleBody(article.ArticleId)
            };
        }

        // GET: Home
        public async Task<ActionResult> Index(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return View();
            }
            else
            {
                var vm = await getArticleViewModel(id);
                if (vm == null) return View();
                return View(vm);
            }
        }

        public ActionResult Page404()
        {
            return View();
        }
    }
}