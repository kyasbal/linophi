using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.ViewModel.Admin;

namespace Web.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TopicList()
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            var vm = new TopicListViewModel(context);
            vm.TopicItems = context.Topics;
            return View(vm);
        }
    }
}