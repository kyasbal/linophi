using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class MyPageController : Controller
    {
        // GET: MyPage
        public ActionResult Index()
        {
            return View();
        }
    }
}