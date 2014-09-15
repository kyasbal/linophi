using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Manager;

namespace Web.Models.Cron
{
    public class CurrentRankingModel
    {
        [Key]
        public string ArticleId { get; set; }
    
        public double PVCoefficient { get; set; }

        public double CommentCoefficient { get; set; }

        public double LabelCoefficient { get; set; }
        public string TopicId { get; set; }
    }
}