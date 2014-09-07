
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
        /// <summary>
        /// 記事表示用のVMを生成するメソッド
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        private async Task<ViewArticleViewModel> getArticleViewModel(string articleId)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            var article =  await context.Articles.FindAsync(articleId);
            if (article == null) return null;
            await context.Entry(article).Collection(c=>c.Tags).LoadAsync();
            BlobStorageConnection bConnection = new BlobStorageConnection();
            TableStorageConnection tConnection = new TableStorageConnection();
            ArticleBodyTableManager manager=new ArticleBodyTableManager(bConnection);
            ArticleThumbnailManager thumbnail=new ArticleThumbnailManager(bConnection);
            LabelTableManager ltm=new LabelTableManager(tConnection);
            ArticleCommentTableManager actm=new ArticleCommentTableManager(tConnection);
            var author =
                await
                    HttpContext.GetOwinContext()
                        .GetUserManager<ApplicationUserManager>()
                        .FindByNameAsync(article.AuthorID);
            if (article.IsDraft)
            {
                if (article.AuthorID != User.Identity.Name) return null;
            }
            else
            {
                article.PageView++;
            }
            await context.SaveChangesAsync();
            IGravatarLoader gLoader=new BasicGravatarLoader(author.Email);
            return new ViewArticleViewModel()
            {
                ArticleId = articleId,
                Author=author.NickName,
                Author_ID=author.UniqueId,
                Author_IconTag=gLoader.GetIconTag(64),
                PageView=article.PageView,
                Title = article.Title,
                Content =await manager.GetArticleBody(article.ArticleModelId),
                LabelInfo=ltm.GetLabelsJson(articleId),
                Tags =await getArticleTagModels(article),
                LabelCount = article.LabelCount,
                Article_Date = article.CreationTime.ToShortDateString(),
                Article_UpDate = article.UpdateTime.ToShortDateString(),
                UseThumbnail= thumbnail.CheckThumbnailExist(articleId),
                CommentInfo=actm.GetCommentsAsJson(articleId)
            };
        }

        private async Task<IEnumerable<TagViewModel>> getArticleTagModels(ArticleModel article)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            int tagCount = article.Tags.Count;
            var tagVms = new TagViewModel[tagCount];
            int count = 0;
            foreach (var tagRef in article.Tags)
            {
                await context.Entry(tagRef).Collection(c => c.Articles).LoadAsync();
                tagVms[count] = new TagViewModel()
                {
                    ArticleCount = tagRef.Articles.Count,
                    TagId = tagRef.ArticleTagModelId,
                    TagName = tagRef.TagName
                };
                count++;
            }
            return tagVms;
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

        public async Task<ActionResult> Search(string searchText,int skip=0,int order=0)
        {
            if(searchText==null)return View(new SearchResultViewModel() {Articles = new SearchResultArticle[0]});
            string[] queries=searchText.Split(' ');
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            string first = queries[0];
            var result=context.Articles.Where((f) => f.Title.Contains(first)&&!f.IsDraft);
            for (int index = 1; index < Math.Min(4,queries.Length); index++)
            {
                var query = queries[index];
                result=result.Where(f => f.Title.Contains(query));
            }
            result = ChangeOrder(order, result);
            result = result.Skip(skip);
            SearchResultViewModel vm=new SearchResultViewModel();
            List<SearchResultArticle> articles=new List<SearchResultArticle>();
            int count = await result.CountAsync();
            foreach (var source in result.Take(20))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = source.LabelCount,
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
                vm.SearchResultText = string.Format("「{0}」に関する検索結果:{1}件中{2}～{3}件", searchText,count,skip+1,Math.Min(skip+21,count));
            }
            vm.SearchText = searchText;
            return View(vm);
        }

        private static IQueryable<ArticleModel> ChangeOrder(int order, IQueryable<ArticleModel> result)
        {
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
            return result;
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
            ChangeOrder(order, query);
            query=query.Skip(skip);
            foreach (var source in query.Take(10))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = source.LabelCount,
                    PageView = source.PageView,
                    Title = source.Title
                });
            }
            vm.Articles = articles.ToArray();
            vm.SearchText = tag;
            return View("Search", vm);
        }

        [HttpGet]
        [Authorize]
        public  ActionResult MyPage(int order=0,int skip=0)
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            IQueryable<ArticleModel> query= context.Articles.Where(f => f.AuthorID.Equals(User.Identity.Name));
            query=ChangeOrder(order,query);
            query =query.Skip(skip);
            List<SearchResultArticle> articles = new List<SearchResultArticle>();
            foreach (var source in query.Take(10))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = source.LabelCount,
                    PageView = source.PageView,
                    Title = source.Title
                });
            }
            return View(new MyPageViewModel() {articles = articles.ToArray()});
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteArticle(string articleId)
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleModel article = await context.Articles.FindAsync(articleId);
            if (article==null||!article.AuthorID.Equals(User.Identity.Name)) return View("Page403");
            context.Entry(article).Collection(a => a.Tags);
            article.Tags.Clear();
            BlobStorageConnection connection=new BlobStorageConnection();
            ArticleBodyTableManager abtm=new ArticleBodyTableManager(connection);
            ArticleMarkupTableManager amtm=new ArticleMarkupTableManager(connection);
            await abtm.RemoveArticle(articleId);
            await amtm.RemoveArticle(articleId);
            context.Articles.Remove(article);
            await context.SaveChangesAsync();
            return RedirectToAction("MyPage");
        }

        [HttpGet]
        public async Task<ActionResult> UserPage(string articleId,int order=0,int skip=0)
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            ArticleModel articleModel = await context.Articles.FindAsync(articleId);
            string userId = articleModel.AuthorID;
            if (User.Identity.Name.Equals(userId)) return Redirect("MyPage");
            IQueryable<ArticleModel> query = context.Articles.Where(f => f.AuthorID.Equals(userId));
            query = ChangeOrder(order, query);
            query = query.Skip(skip);
            List<SearchResultArticle> articles = new List<SearchResultArticle>();
            foreach (var source in query.Take(10))
            {
                articles.Add(new SearchResultArticle()
                {
                    ArticleId = source.ArticleModelId,
                    LabelCount = source.LabelCount,
                    PageView = source.PageView,
                    Title = source.Title
                });
            }
            return View("MyPage",new MyPageViewModel() { articles = articles.ToArray() });
        }
    }
}