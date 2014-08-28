
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Web.Models;
using Web.Storage;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        private ViewArticleViewModel getArticleViewModel(string articleId)
        {
            ApplicationDbContext context=new ApplicationDbContext();
            var article=context.Articles.FirstOrDefault(a => a.ArticleId.Equals(articleId));
            if (article == null) return null;
            ParagraphTableManager pm=new ParagraphTableManager(new TableStorageConnection());
            var ps=pm.GetParagraphs(articleId, 0);
            var ps4json = new ParagraphDataModel[ps.Length];
            Parallel.For(0, ps.Length, (index) =>
            {
                var paragraphEntity = ps[index];
                ps4json[index] = ParagraphDataModel.GetFromStorage(paragraphEntity);
            });
            return new ViewArticleViewModel()
            {
                Content = System.Web.Helpers.Json.Encode(new ViewArticleContentStructure()
                {
                  ArticleTitle  = article.Title,
                  UpdateTime = article.UpdateTime.ToString(),
                  Tags = article.Tags==null?null:article.Tags.ToArray(),
                  Paragraphs = ps4json
                })
            };
        }

        // GET: Home
        public ActionResult Index(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return View();
            }
            else
            {
                var vm = getArticleViewModel(id);
                if (vm == null) return View();
                return View(vm);
            }
        }
    }
}