﻿

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class ArticleEditViewModel
    {
        private string _topicId;
        public string MarkupString { get; set; }
        public string Title { get; set; }
        public string Tags { get; set; }
        public string ArticleId { get; set; }
        public string EditMode { get; set; }
        public string RelatedArticle { get; set; }

        public string TopicId
        {
            get { return _topicId; }
            set { _topicId = value; }
        }
    }
}