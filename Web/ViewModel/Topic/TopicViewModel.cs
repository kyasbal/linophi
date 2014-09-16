using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.Models.Cron;
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
            TopicViewModel vm = new TopicViewModel(req, topic.TopicTitle, topic.LongDescription,
                "/Pages/ContentUpload/TopicThumbnail?topicId=" + topicId);
            vm.HtmlDescription = topic.LongDescription;
            IOrderedQueryable<ArticleModel> newArticleQuery =
                context.Articles.Where(f => !f.IsDraft && f.ThemeId.Equals(topicId)).OrderBy(f => f.UpdateTime);
            List<CurrentRankingModel> rankingModel =
                context.CurrentRanking.Where(f => f.TopicId.Equals(topicId))
                    .OrderBy(f => f.PVCoefficient).Take(20).ToList();
            var hotModels = rankingModel.Select(f => context.Articles.Find(f.ArticleId));
            vm.NewArticles = newArticleQuery;
            vm.HotModels = hotModels;
            vm.TopicId = topicId;
            return vm;
        }

        public string TopicId { get; private set; }
        public IEnumerable<ArticleModel> HotModels
        {
            get { return _hotModels; }
            private set { _hotModels = value; }
        }

        public IOrderedQueryable<ArticleModel> NewArticles
        {
            get { return _newArticles; }
            private set { _newArticles = value; }
        }

        public string Title
        {
            get { return _title; }
        }

        public string HtmlDescription { get; private set; }

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
        private IOrderedQueryable<ArticleModel> _newArticles;
        private IEnumerable<ArticleModel> _hotModels;

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