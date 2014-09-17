using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Web.ViewModel.Topic;

namespace Web.Controllers
{
    public class TopicController : Controller
    {
        // GET: Topic
        public async Task<ActionResult> Index(string topicId)
        {
            TopicViewModel vm = await TopicViewModel.GenerateViewModel(Request, topicId);
            if (vm == null)
            {
                return RedirectToAction("Page404", "Home");
            }
            return View(vm);
        }
    }
}