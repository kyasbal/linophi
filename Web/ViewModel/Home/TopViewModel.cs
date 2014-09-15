using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Web.Models;
using Web.Models.Topic;
using Web.Utility.Configuration;

namespace Web.ViewModel.Home
{
    public class TopViewModel:OGPViewModelBase
    {
        private const int TopTakeCount = 3;
        public async static Task<TopViewModel> GetTopViewModel(ApplicationDbContext context,bool isDebug)
        {
            TopViewModel viewModel=new TopViewModel();
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
                viewModel.TopicSections[count]=TopicSection.FromModel(context,topicModel);
                count++;
            }
            return viewModel;
        }

        public TopViewModel() : base(ConfigurationLoaderFactory.GetConfigurationLoader().GetConfiguration("SiteTitle")
            ,"","","http://意見.みんな","website",ConfigurationLoaderFactory.GetConfigurationLoader().GetConfiguration("SiteTitle")
            )
        {
        }

        public TopicSection[] TopicSections { get; set; }
        public class TopicSection
        {
            public string TopicId { get; set; }

            public string TopicTitle { get; set; }
            public string TopicDescription { get; set; }

            public IEnumerable<ArticleModel> FlamedModels { get; set; }
 
            public IEnumerable<ArticleModel> NewModels { get; set; } 

            public static TopicSection FromModel(ApplicationDbContext context,TopicModel topicModel)
            {
                TopicSection section=new TopicSection();
                section.TopicTitle = topicModel.TopicTitle;
                section.TopicId = topicModel.TopicId;
                section.TopicDescription = topicModel.Description;
                ArticleModel[] newArticles =
                    context.Articles.Where(f => !f.IsDraft && f.ThemeId.Equals(topicModel.TopicId))
                        .OrderBy(f => f.CreationTime)
                        .Take(3)
                        .ToArray();
                List<ArticleModel> flamedArticles=new List<ArticleModel>();
                section.NewModels = newArticles;
                return section;
            }
        }
    }
}