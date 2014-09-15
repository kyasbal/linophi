using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.Models.Topic;
using Web.ViewModel.Admin;

namespace Web.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AdminController : Controller
    {
        private ApplicationDbContext dbContext;
        public ApplicationDbContext DbContext
        {
            get
            {
                dbContext = dbContext ?? Request.GetOwinContext().Get<ApplicationDbContext>();
                return dbContext;
            }
        }

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult TopicList()
        {
            var vm = new TopicListViewModel(DbContext);
            vm.TopicItems = DbContext.Topics;
            return View(vm);
        }
        [HttpGet]
        public async Task<ActionResult> EditTopic(string topicId)
        {
            var vm = new EditTopicViewModel();
            vm.TopicId = topicId;
            vm.EditTarget = await DbContext.Topics.FindAsync(topicId);
            return View(vm);
        }

        [HttpPost]
        public async Task<ActionResult> EditTopic(EditTopicViewModel vm)
        {
            vm.EditTarget.TopicId = vm.TopicId;
            TopicModel lastModel = await DbContext.Topics.FindAsync(vm.TopicId);
            DbContext.Topics.Remove(lastModel);
            await DbContext.SaveChangesAsync();
            DbContext.Topics.Add(vm.EditTarget);
            await DbContext.SaveChangesAsync();
            return View(vm);
        }
    }
}