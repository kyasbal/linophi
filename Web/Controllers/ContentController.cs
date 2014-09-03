using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class ContentController : Controller
    {
        private const int NicoWidth = 560;

        private const int NicoHeight = 315;
        public ActionResult Nico(string id)
        {
            //return View();
            return Content(String.Format("<script type=\"text/javascript\" src=\"http://ext.nicovideo.jp/thumb_watch/{0}?w={1}&h={2}\"></script>",id,NicoWidth,NicoHeight));
        }
    }
}