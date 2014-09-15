using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Services.Client;
using Microsoft.AspNet.Identity.EntityFramework;
using Web.Models.Cron;
using Web.Models.Topic;
using Web.Utility.Configuration;

namespace Web.Models
{
    public class ApplicationDbContext : IdentityDbContext<UserAccount>
    {
        public ApplicationDbContext()
            : base(ConfigurationLoaderFactory.GetConfigurationLoader().GetConfiguration("SQL-ConnectionString"), throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<ArticleModel> Articles { get; set; } 

        public DbSet<ArticleTagModel>  Tags { get; set; }

        public DbSet<StatisticsLogModel> StatisticsLog { get; set; } 

        public DbSet<CurrentRankingModel> CurrentRanking { get; set; } 

        public DbSet<TopicModel> Topics { get; set; } 

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
//            modelBuilder.Entity<ArticleModel>()
//                .HasMany(c => c.Tags).WithMany()
//                .Map(x =>
//                {
//                    x.MapLeftKey("ArticleModelId");
//                    x.MapRightKey("ArticleTagModelId");
//                    x.ToTable("TagArticleMapping");
//                });
            base.OnModelCreating(modelBuilder);
        }
    }
}