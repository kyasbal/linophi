using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage.Cron
{
    public class DailyArticleLogManager : AzureTableManagerBase<DailyArticleLogEntity>
    {
        public DailyArticleLogManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public Task InsertArticleLog(string logId,string lastLogId="")
        {
            
        }
}

    public class DailyArticleLogEntity:TableEntity
    {
        public DailyArticleLogEntity()
        {
            
        }

        public DailyArticleLogEntity(string statisticsId,string articleKey) : base(statisticsId, articleKey)
        {
        }
        /// <summary>
        /// この時間のラベルのカウントの累計
        /// </summary>
        public int LabelCount { get; set; }

        /// <summary>
        /// この時間のラベルのカウントの累計と前回の時間のラベルのカウントの累計の差
        /// </summary>
        public int LabelCountDifferential { get; set; }

        /// <summary>
        /// この時間のラベルのカウントの累計の微分係数
        /// </summary>
        public double LabelCountDifferentialPerTime { get; set; }

        /// <summary>
        /// この時間のラベルのカウントの累計の２重微分係数
        /// </summary>
        public double LabelCountDifferentialDifferentialPerTime { get; set; }

        /// <summary>
        /// この時間のPV数の累計
        /// </summary>
        public int PageView { get; set; }

        /// <summary>
        /// この時間のPV数と前回の時間のラベルのカウントの累計の差
        /// </summary>
        public int PageViewDifferential { get; set; }

        /// <summary>
        /// この時間のPV数の累計の微分係数
        /// </summary>
        public double PageViewDifferentialPerTime { get; set; }

        /// <summary>
        /// この時間のPV数の累計の２重微分係数
        /// </summary>
        public double PageViewDifferentialDifferentialPerTime { get; set; }

        /// <summary>
        /// この時間のコメント数の累計
        /// </summary>
        public int CommentCount { get; set; }

        /// <summary>
        /// この時間のコメント数の累計と前の時間のコメント数の累計の差
        /// </summary>
        public int CommentCountDifferential { get; set; }
        /// <summary>
        /// この時間のコメント数の微分係数
        /// </summary>
        public double CommentCountDifferentialPerTime { get; set; }

        /// <summary>
        /// この時間のコメント数の2重微分係数
        /// </summary>
        public double CommentCountDifferentialDifferentialPerTime { get; set; }