
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
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
            var article = context.Articles.FirstOrDefault(a => a.ArticleModelId.Equals(articleId));
            if (article == null) return null;
            ArticleBodyTableManager manager=new ArticleBodyTableManager(new BlobStorageConnection());
            LabelTableManager ltm=new LabelTableManager(new TableStorageConnection());
            var author=await HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(article.AuthorID);
            article.PageView++;
            context.SaveChanges();
            return new ViewArticleViewModel()
            {
                Author=author.NickName,
                Author_ID=author.UniqueId,
                PageView=article.PageView,
                Title = article.Title,
                Content =await manager.GetArticleBody(article.ArticleModelId),
                LabelInfo=ltm.GetLabelsJson(articleId),
                Tags = getArticleTagModels(article)
            };
        }

        private IEnumerable<TagViewModel> getArticleTagModels(ArticleModel article)
        {
            return null;
            

/*            foreach (var tagRef in article.Tags)
            {
                yield return new TagViewModel(){ArticleCount = tagRef.Articles.Count,TagId = tagRef.ArticleTagModelId,TagName = tagRef.TagName};
            }*/
        }

        // GET: Home
        public async Task<ActionResult> Index(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return View("Top");
            }
            else
            {
                var vm = await getArticleViewModel(id);
                if (vm == null || vm.Content == null) return Redirect("/");
                return View(vm);
            }
        }

        public ActionResult Page404()
        {
            return View();
        }

        public ActionResult Search(string searchText,int skip=0)
        {
            if(searchText==null)return View(new SearchResultViewModel() {Articles = new SearchResultArticle[0]});
            string[] queries=searchText.Split(' ');
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            string first = queries[0];
            var result=context.Articles.Where((f) => f.Title.Contains(first));
            for (int index = 1; index < Math.Min(4,queries.Length); index++)
            {
                var query = queries[index];
                result=result.Where(f => f.Title.Contains(query));
            }
            result = result.OrderBy(f => f.CreationTime);
            result = result.Skip(skip);
            SearchResultViewModel vm=new SearchResultViewModel();
            List<SearchResultArticle> articles=new List<SearchResultArticle>();
            foreach (var source in result.Take(10))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = 0,
                    PageView = source.PageView,
                    Title = source.Title
                });
            }
            vm.Articles = articles.ToArray();
            return View(vm);
        }
    }
}