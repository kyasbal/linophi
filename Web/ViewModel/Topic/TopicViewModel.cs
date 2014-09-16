using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.Models.Topic;
using Web.Utility.OGP;

namespace Web.ViewModel.Topic
{
    public class TopicViewModel:BasicOGPSupportedViewModel
    {

        public static async Task<TopicViewModel> GenerateViewModel(HttpRequestBase req,string topicId)
        {
            var context = req.GetOwinContext().Get<ApplicationDbContext>();
            TopicModel topic = await context.Topics.FindAsync(topicId);
            if (topic == null) return null;
            TopicViewModel vm = new TopicViewModel(req, topic.TopicTitle, topic.Description,
               "/Pages/ContentUpload/TopicThumbnail?topicId=" + topicId);
            return vm;
        }

        public string Title
        {
            get { return _title; }
        }

        public string Description
        {
            get { return _description; }
        }

        public string Image
        {
            get { return _image; }
        }

        private string _description;
        private string _image;
        private string _title;

        public TopicViewModel(HttpRequestBase request, string title, string description, string image) : base(request)
        {
            _title = title;
            _description = description;
            _image = image;
        }        

        protected override void GetOGPPageData(out string title, out string description, out string image)
        {
            title = _title;
            description = _description;
            image = _image;
        }
    }
}