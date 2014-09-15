using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Models;
using Web.Models.Cron;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage.Cron
{
    [TableStorage("ArticleStatisticsBasic")]
    public class ArticleStatisticsBasicManager : AzureTableManagerBase<ArticleStatisticsBasicEntity>
    {
        public ArticleStatisticsBasicManager(TableStorageConnection connection, string suffix = "")
            : base(connection, suffix)
        {
        }

        public async Task InsertArticleLog(ApplicationDbContext dbContext, string statisticsId,
            string lastStatisticsId = "")
        {
            StatisticsLogModel statisticsLog = await dbContext.StatisticsLog.FindAsync(statisticsId);
            var commentTable = new ArticleCommentTableManager(new TableStorageConnection());
            foreach (ArticleModel articleModel in dbContext.Articles)
            {
                string articleId = articleModel.ArticleModelId;
                var article = new ArticleStatisticsBasicEntity(statisticsId, articleId);
                article.ArticleTitle = articleModel.Title;
                ArticleStatisticsBasicEntity lastStatisticsBasic =
                    CreateQuery()
                        .Where(f => f.PartitionKey.Equals(lastStatisticsId) && f.RowKey.Equals(articleId))
                        .FirstOrDefault();
                if (String.IsNullOrWhiteSpace(lastStatisticsId) || lastStatisticsBasic == null)
                {
//この記事に対するログがない場合
                    article.LabelCount = article.LabelCountDifferential = articleModel.LabelCount;
                    article.PageView = article.PageViewDifferential = articleModel.PageView;
                    article.CommentCount = article.CommentCountDifferential = commentTable.GetCommentCount(articleId);
                    article.LabelCountDifferentialPerTime = article.LabelCountDifferentialDifferentialPerTime = 0;
                    article.PageViewDifferentialPerTime = article.PageViewDifferentialDifferentialPerTime = 0;
                    article.CommentCountDifferentialPerTime = article.CommentCountDifferentialDifferentialPerTime = 0;
                }
                else
                {
                    double timeDifference = (DateTime.Now - statisticsLog.JobTime).TotalSeconds;
                    article.LabelCount = articleModel.LabelCount;
                    article.PageView = articleModel.PageView;
                    article.CommentCount = commentTable.GetCommentCount(articleId);
                    article.LabelCountDifferential = articleModel.LabelCount - lastStatisticsBasic.LabelCount;
                    article.PageViewDifferential = articleModel.PageView - lastStatisticsBasic.PageView;
                    article.CommentCountDifferential = commentTable.GetCommentCount(articleId) -
                                                       lastStatisticsBasic.CommentCount;
                    article.LabelCountDifferentialPerTime = article.LabelCountDifferential/timeDifference;
                    article.PageViewDifferentialPerTime = article.PageViewDifferential/timeDifference;
                    article.CommentCountDifferentialPerTime = article.CommentCountDifferential/timeDifference;
                    article.CommentCountDifferentialDifferentialPerTime =
                        (article.CommentCountDifferentialPerTime - lastStatisticsBasic.CommentCountDifferentialPerTime)/
                        timeDifference;
                    article.PageViewDifferentialDifferentialPerTime =
                        (article.PageViewDifferentialPerTime - lastStatisticsBasic.PageViewDifferentialPerTime)/
                        timeDifference;
                    article.LabelCountDifferentialDifferentialPerTime =
                        (article.LabelCountDifferentialPerTime - lastStatisticsBasic.LabelCountDifferentialPerTime)/
                        timeDifference;
                }
                await Table.ExecuteAsync(TableOperation.Insert(article));
                CurrentRankingModel rankingModel = await dbContext.CurrentRanking.FindAsync(articleId);
                if (rankingModel == null)
                {
                    rankingModel = new CurrentRankingModel();
                    rankingModel.ArticleId = articleId;
                    rankingModel.CommentCoefficient = article.CommentCountDifferentialDifferentialPerTime;
                    rankingModel.LabelCoefficient = article.LabelCountDifferentialDifferentialPerTime;
                    rankingModel.PVCoefficient = article.PageViewDifferentialDifferentialPerTime;
                    dbContext.CurrentRanking.Add(rankingModel);

                }
                else
                {
                    rankingModel.ArticleId = articleId;
                    rankingModel.CommentCoefficient = article.CommentCountDifferentialDifferentialPerTime;
                    rankingModel.LabelCoefficient = article.LabelCountDifferentialDifferentialPerTime;
                    rankingModel.PVCoefficient = article.PageViewDifferentialDifferentialPerTime;
                }
            }
            await dbContext.SaveChangesAsync();
        }
    }

    public class ArticleStatisticsBasicEntity : TableEntity
    {
        public ArticleStatisticsBasicEntity()
        {
        }

        public ArticleStatisticsBasicEntity(string statisticsId, string articleKey) : base(statisticsId, articleKey)
        {
        }

        /// <summary>
        ///     記事のタイトル(管理しやすい用)
        /// </summary>
        public string ArticleTitle { get; set; }

        /// <summary>
        ///     この時間のラベルのカウントの累計
        /// </summary>
        public int LabelCount { get; set; }

        /// <summary>
        ///     この時間のラベルのカウントの累計と前回の時間のラベルのカウントの累計の差
        /// </summary>
        public int LabelCountDifferential { get; set; }

        /// <summary>
        ///     この時間のラベルのカウントの累計の微分係数
        /// </summary>
        public double LabelCountDifferentialPerTime { get; set; }

        /// <summary>
        ///     この時間のラベルのカウントの累計の２重微分係数
        /// </summary>
        public double LabelCountDifferentialDifferentialPerTime { get; set; }

        /// <summary>
        ///     この時間のPV数の累計
        /// </summary>
        public int PageView { get; set; }

        /// <summary>
        ///     この時間のPV数と前回の時間のラベルのカウントの累計の差
        /// </summary>
        public int PageViewDifferential { get; set; }

        /// <summary>
        ///     この時間のPV数の累計の微分係数
        /// </summary>
        public double PageViewDifferentialPerTime { get; set; }

        /// <summary>
        ///     この時間のPV数の累計の２重微分係数
        /// </summary>
        public double PageViewDifferentialDifferentialPerTime { get; set; }

        /// <summary>
        ///     この時間のコメント数の累計
        /// </summary>
        public int CommentCount { get; set; }

        /// <summary>
        ///     この時間のコメント数の累計と前の時間のコメント数の累計の差
        /// </summary>
        public int CommentCountDifferential { get; set; }

        /// <summary>
        ///     この時間のコメント数の微分係数
        /// </summary>
        public double CommentCountDifferentialPerTime { get; set; }

        /// <summary>
        ///     この時間のコメント数の2重微分係数
        /// </summary>
        public double CommentCountDifferentialDifferentialPerTime { get; set; }

    }
}