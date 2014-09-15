using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Web.Models;
using Web.Models.Topic;

namespace Web.ViewModel.Home
{
    public class TopViewModel
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
                viewModel.TopicSections[count]=TopicSection.FromModel(topicModel);
                count++;
            }
            return viewModel;
        }

        public TopViewModel()
        {
        }

        public TopicSection[] TopicSections { get; set; }
        public class TopicSection
        {
            public string TopicId { get; set; }

            public string TopicTitle { get; set; }
            public string TopicDescription { get; set; }

            public static TopicSection FromModel(TopicModel topicModel)
            {
                TopicSection section=new TopicSection();
                section.TopicTitle = topicModel.TopicTitle;
                section.TopicId = topicModel.TopicId;
                section.TopicDescription = topicModel.Description;
                return section;
            }
        }
    }
}