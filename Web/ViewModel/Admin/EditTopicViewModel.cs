using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models.Topic;

namespace Web.ViewModel.Admin
{
    public class EditTopicViewModel
    {
        public string TopicId { get; set; }
        public TopicModel EditTarget { get; set; }

        public HttpPostedFileBase Thumbnail { get; set; }
    }
}