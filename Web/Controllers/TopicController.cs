using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class TopicController : Controller
    {
        // GET: Topic
        public ActionResult Index(string topicId)
        {
            return View();
        }
    }
}