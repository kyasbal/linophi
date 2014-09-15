using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Web.Models;
using Web.Models.Topic;

namespace Web.ViewModel.Admin
{
    public class TopicListViewModel
    {
        private ApplicationDbContext context;

        public TopicListViewModel(ApplicationDbContext context)
        {
            this.context = context;
        }

        public IQueryable<TopicModel> TopicItems { get; set; }

        public int CountArticleInTopic(string topicId)
        {
            return context.Articles.Where(f => f.ThemeId.Equals(topicId)).Count();
        }
    }
}