using System.Data.Entity;
using System.Data.Services.Client;
using linophi.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using Web.Utility.Configuration;

namespace Web.Models
{
    public class ApplicationDbContext : IdentityDbContext<UserAccount>
    {
        private ApplicationDbContext()
            : base(ConfigurationLoaderFactory.GetConfigurationLoader().GetConfiguration("SQL-ConnectionString"), throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<ArticleModel> Articles { get; set; } 
    }
}