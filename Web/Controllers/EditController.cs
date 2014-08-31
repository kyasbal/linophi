using System.Net;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Web.Api.Article;
using Web.Models;
using Web.Storage;

namespace Web.Controllers
{
    [Authorize]
    public class EditController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult RedirectToEdit()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index");
            }
            else
            {
                return Redirect("/Account/Login?returnUrl=/RedirectToEdit");
            }
        }

        [HttpGet]
        [Authorize]
        // GET: Edit
        public ActionResult Index()
        {
            return View();
        }
        [Authorize]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Index(EditViewModel vm)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            if (!ArticleController.IsValidTitle(vm.Title, context).IsOK) return RedirectToAction("Page404", "Home");
            var article = ArticleModel.GenerateArticle(vm.Title, null);
            context.Articles.Add(article);
            context.SaveChanges();
            var data=System.Web.Helpers.Json.Decode<ParagraphDataModel[]>(vm.Context);
            var connection = new TableStorageConnection();
            ParagraphTableManager ptm=new ParagraphTableManager(connection);
            foreach (var paragraphDataModel in data)
            {
                ptm.AddParagraph(article.ArticleId,0,paragraphDataModel);
            }
            ArticleBodyTableManager abtm=new ArticleBodyTableManager(connection);
            abtm.AddArticle(article.ArticleId,vm.Body);
            return Redirect("~/"+article.ArticleId);
        }
    }
}