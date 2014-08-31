using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Web.Models;

namespace Web
{
    // このアプリケーションで使用されるアプリケーション ユーザー マネージャーを設定します。UserManager は ASP.NET Identity の中で定義されており、このアプリケーションで使用されます。

    public class ApplicationUserManager : UserManager<UserAccount>
    {
        public ApplicationUserManager(IUserStore<UserAccount> store)
            : base(store)
        {
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<UserAccount>(context.Get<ApplicationDbContext>()));
            // ユーザー名の検証ロジックを設定します
            manager.UserValidator = new UserValidator<UserAccount>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // パスワードの検証ロジックを設定します
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<UserAccount>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }
}
