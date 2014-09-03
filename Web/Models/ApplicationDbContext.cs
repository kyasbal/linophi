using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Services.Client;
using Microsoft.AspNet.Identity.EntityFramework;
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
    }
}