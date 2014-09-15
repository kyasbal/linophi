using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Web.Utility;

namespace Web.Models.Cron
{
    public class StatisticsLogModel
    {
        public static StatisticsLogModel CreateNewModel()
        {
            var model = new StatisticsLogModel();
            model.Key = IdGenerator.getId(10);
            model.JobTime = DateTime.Now;
            return model;
        }

        public StatisticsLogModel()
        {
            
        }
        [Key]
        public string Key { get; set; }

        public DateTime JobTime { get; set; }
    }
}