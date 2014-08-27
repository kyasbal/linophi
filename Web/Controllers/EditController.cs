using System.Web.Mvc;
using Web.Models;
<<<<<<< HEAD
// using Web.Storage;
=======
>>>>>>> 4d9b42f088d30a5a5b5120b5318b3f66a93e9570

namespace Web.Controllers
{
    public class EditController : Controller
    {
        
        // GET: Edit
        public ActionResult Index()
        {
//            EditViewModel vm = new EditViewModel();
//            vm.title = "Title";
//            vm.parapraphs = new ParagraphViewModel[]
//            {
//                new ParagraphViewModel()
//                {
//                    id = "idididid",
//                    nextParagraph = "nextidididid",
//                    prevParagraph = "previdididid",
//                    paragraphIndex = 10,
//                    rawText = "rawrawraw"
//                }, new ParagraphViewModel()
//                {
//                    id = "idididid2",
//                    nextParagraph = "nextidididid2",
//                    prevParagraph = "previdididid2",
//                    paragraphIndex = 11,
//                    rawText = "rawrawraw2"
//                },
//                new ParagraphViewModel()
//                {
//                    id = "idididid3",
//                    nextParagraph = "nextidididid3",
//                    prevParagraph = "previdididid3",
//                    paragraphIndex = 10,
//                    rawText = "rawrawraw3"
//                }
//            };
//            return Json(vm,JsonRequestBehavior.AllowGet);
            return View();
        }
        [HttpPost]
        public ActionResult Index(EditViewModel vm)
        {
            ApplicationDbContext context=new ApplicationDbContext();
            context.Articles.Add(ArticleModel.GenerateArticle(vm.Title, null));
            context.SaveChanges();
            return null;
        }
    }
}