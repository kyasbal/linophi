using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using Web.Api.Cron.Request;
using Web.Models;
using Web.Models.Cron;
using Web.Storage.Connection;
using Web.Storage.Cron;
using Web.Utility;
namespace Web.Api.Cron
{
    public class CronStatisticsController : ApiController
    {
        [HttpGet]
        public async Task<IHttpActionResult> ArticleRankingJob(CronRequest req)
        {
//            if (CronRequest.IsCronRequest(req))
//            {
                var context = Request.GetOwinContext().Get<ApplicationDbContext>();
                TableStorageConnection tConnection = new TableStorageConnection();
                StatisticsLogModel logModel = StatisticsLogModel.CreateNewModel();
            StatisticsLogModel lastLog = context.StatisticsLog.OrderByDescending(f => f.JobTime).Take(1).FirstOrDefault();
            context.StatisticsLog.Add(logModel);
            await context.SaveChangesAsync();
                ArticleStatisticsBasicManager asbm=new ArticleStatisticsBasicManager(tConnection);
                await asbm.InsertArticleLog(context, logModel.Key, lastLog==null?"":lastLog.Key);
                return Json(true);
//            }
//            else
//            {
//                return Json(false);
//            }
        }

        public async Task<IHttpActionResult> TopicEvaluationUpdateJob()
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            foreach (var topicModel in context.Topics)
            {
                double sumOfValue = 0;
                foreach (var source in context.Articles.Where(f => f.ThemeId.Equals(topicModel.TopicId)))
                {
                    CurrentRankingModel ranking = await context.CurrentRanking.FindAsync(source.ArticleModelId);
                    sumOfValue += ranking.PVCoefficient;
                }
                topicModel.EvaluationOfFire = sumOfValue;
            }
            await context.SaveChangesAsync();
            return Json(true);
        }
    }
}
