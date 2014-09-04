
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
using Web.Utility;

namespace Web.Controllers
{
    public class HomeController : Controller
    {

        private async Task<ViewArticleViewModel> getArticleViewModel(string articleId)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            var article = context.Articles.FirstOrDefault(a => a.ArticleModelId.Equals(articleId));
            context.Entry(article).Collection(c=>c.Tags).Load();
            if (article == null) return null;
            ArticleBodyTableManager manager=new ArticleBodyTableManager(new BlobStorageConnection());
            LabelTableManager ltm=new LabelTableManager(new TableStorageConnection());
            var author=await HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(article.AuthorID);
            article.PageView++;
            context.SaveChanges();
            IGravatarLoader gLoader=new BasicGravatarLoader(author.Email);
            return new ViewArticleViewModel()
            {
                Author=author.NickName,
                Author_ID=author.UniqueId,
                Author_IconTag=gLoader.GetIconTag(64),
                PageView=article.PageView,
                Title = article.Title,
                Content =await manager.GetArticleBody(article.ArticleModelId),
                LabelInfo=ltm.GetLabelsJson(articleId),
                Tags = getArticleTagModels(article),
                LabelCount = article.LabelCount,
                Article_Date = article.CreationTime.ToShortDateString(),
                Article_UpDate = article.UpdateTime.ToShortDateString()
            };
        }

        private IEnumerable<TagViewModel> getArticleTagModels(ArticleModel article)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();

            foreach (var tagRef in article.Tags)
            
            {
                context.Entry(tagRef).Collection(c=>c.Articles).Load();
                yield return new TagViewModel(){ArticleCount = tagRef.Articles.Count,TagId = tagRef.ArticleTagModelId,TagName = tagRef.TagName};
            }
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

        public ActionResult Search(string searchText,int skip=0,int order=0)
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
            switch (order)
            {
                case 5:
                    result = result.OrderBy(f => f.LabelCount);
                    break;
                case 4:
                    result = result.OrderBy(f => f.PageView);
                    break;
                case 3:
                    result = result.OrderBy(f => f.CreationTime);
                    break;
                case 2:
                    result = result.OrderByDescending(f => f.LabelCount);
                    break;
                case 1:
                    result = result.OrderByDescending(f => f.PageView);
                    break;
                case 0:
                default:
                    result = result.OrderByDescending(f => f.CreationTime);
                    break;
            }
            result = result.Skip(skip);
            SearchResultViewModel vm=new SearchResultViewModel();
            List<SearchResultArticle> articles=new List<SearchResultArticle>();
            int count = result.Count();
            foreach (var source in result.Take(10))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = 0,
                    PageView = source.PageView,
                    Title = source.Title,
                    Article_UpDate = source.UpdateTime.ToShortDateString()
                });
            }
            vm.Articles = articles.ToArray();
            if (vm.Articles.Length == 0)
            {
                vm.SearchResultText = string.Format("「{0}」に関する検索結果は見つかりませんでした。", searchText);
            }
            else
            {
                vm.SearchResultText = string.Format("「{0}」に関する検索結果:{1}件中{2}～{3}件", searchText,count,skip+1,Math.Min(skip+11,count));
            }
            vm.SearchText = searchText;
            return View(vm);
        }

        public ActionResult Tag(string tag, int skip = 0, int order = 0)
        {
            if (tag == null) return View("Search",new SearchResultViewModel() { Articles = new SearchResultArticle[0] });
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleTagModel tagModel = context.Tags.Where(f => f.TagName.Equals(tag)).FirstOrDefault();
            context.Entry(tagModel).Collection(f=>f.Articles).Load();
            SearchResultViewModel vm = new SearchResultViewModel();
            List<SearchResultArticle> articles = new List<SearchResultArticle>();
            var query = context.Articles.AsQueryable();
            switch (order)
            {
                case 2:
                    query = query.OrderByDescending(f => f.LabelCount);
                    break;
                case 1:
                    query = query.OrderByDescending(f => f.PageView);
                    break;
                case 0:
                default:
                    query = query.OrderByDescending(f => f.CreationTime);
                    break;
            }
            query=query.Skip(skip);
            foreach (var source in query.Take(10))
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
            vm.SearchText = tag;
            return View("Search", vm);
        }
    }
}