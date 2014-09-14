using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using Web.Api.Cron.Request;
using Web.Models.Cron;
using Web.Utility;

namespace Web.Api.Cron
{
    public class CronStatisticsController : ApiController
    {
        public async Task<IHttpActionResult> ArticleRankingJob(CronRequest req)
        {
            if (CronRequest.IsCronRequest(req))
            {
                string jobID = IdGenerator.getId(10);
                StatisticsLogModel logModel = StatisticsLogModel.CreateNewModel();

                return Json(true);
            }
            else
            {
                return Json(false);
            }
        }
    }
}
