using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Web.Models;
using Web.Models.Cron;
using Web.Models.Topic;
using Web.Utility.Configuration;
using Web.Utility.OGP;

namespace Web.ViewModel.Home
{
    public class TopViewModel:BasicOGPSupportedViewModel
    {
        private const int TopTakeCount = 3;
        public async static Task<TopViewModel> GetTopViewModel(HttpRequestBase req,ApplicationDbContext context,bool isDebug)
        {
            TopViewModel viewModel=new TopViewModel(req);
            IQueryable<TopicModel> searchedTopics;
            if (isDebug)
            {
                searchedTopics = context.Topics.OrderBy(f => f.EvaluationOfFire).Take(TopTakeCount);
            }
            else
            {
                searchedTopics = context.Topics.Where(f=>f.IsVisibleToAllUser).OrderBy(f => f.EvaluationOfFire).Take(TopTakeCount);
            }
            viewModel.TopicSections=new TopicSection[await searchedTopics.CountAsync()];
            int count = 0;
            foreach (var topicModel in searchedTopics)
            {
                viewModel.TopicSections[count]=await TopicSection.FromModelAsync(context,topicModel);
                count++;
            }
            //今もえている記事の生成
            List<ArticleModel> flamedArticles = new List<ArticleModel>();
            var flamedArticlesQuery = context.CurrentRanking.Where(f=>true)
                .OrderBy(f => f.PVCoefficient).Take(3).ToList();
            foreach (var rankingModel in flamedArticlesQuery)
            {
                flamedArticles.Add(await context.Articles.FindAsync(rankingModel.ArticleId));
            }
            viewModel.FlameArticles = flamedArticles.ToArray();
            return viewModel;
        }

        public TopViewModel(HttpRequestBase req) : base(req)
        {
        }
        public ArticleModel[] FlameArticles { get; set; }
        public TopicSection[] TopicSections { get; set; }
        public class TopicSection
        {
            public string TopicId { get; set; }

            public string TopicTitle { get; set; }
            public string TopicDescription { get; set; }

            public IEnumerable<ArticleModel> FlamedModels { get; set; }
 
            public IEnumerable<ArticleModel> NewModels { get; set; } 

            public static async Task<TopicSection> FromModelAsync(ApplicationDbContext context,TopicModel topicModel)
            {
                TopicSection section=new TopicSection();
                section.TopicTitle = topicModel.TopicTitle;
                section.TopicId = topicModel.TopicId;
                section.TopicDescription = topicModel.Description;
                ArticleModel[] newArticles =
                    context.Articles.Where(f => !f.IsDraft && f.ThemeId.Equals(topicModel.TopicId))
                        .OrderByDescending(f => f.CreationTime)
                        .Take(3)
                        .ToArray();
                section.NewModels = newArticles;
                List<ArticleModel> flamedArticles = new List<ArticleModel>();
                var flamedArticlesQuery = context.CurrentRanking.Where(f => f.TopicId.Equals(topicModel.TopicId))
                    .OrderBy(f => f.PVCoefficient).Take(3).ToList();
                foreach (var currentRankingModel in flamedArticlesQuery)
                {
                    flamedArticles.Add(await context.Articles.FindAsync(currentRankingModel.ArticleId));
                }
                section.FlamedModels = flamedArticles.ToArray();
                return section;
            }
        }

        protected override void GetOGPPageData(out string title, out string description, out string image)
        {
            title = "意見.みんな|みんなで作る主観メディア";
            description = "ここにTOPの説明が載ります。";
            image = "/Content/imgs/linoris.png";
        }
    }
}