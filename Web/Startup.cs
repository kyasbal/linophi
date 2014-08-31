using System;
using System.Threading.Tasks;
using linophi.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Web.Auth;
using Web.Models;

[assembly: OwinStartup(typeof(Web.Startup))]

namespace Web
{
    public class Startup
    {
        static Startup()
        {
            PublicClientId = "web";

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                AuthorizeEndpointPath = new PathString("/Account/Authorize"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };
        }

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            // アプリケーションの設定方法の詳細については、http://go.microsoft.com/fwlink/?LinkID=316888 を参照してください
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);


            // アプリケーションが Cookie を使用して、サインインしたユーザーの情報を格納できるようにします
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                Provider = new CookieAuthenticationProvider
                {
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, UserAccount>(
                        validateInterval: TimeSpan.FromMinutes(20),
                        regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                }
            });
            // サード パーティのログイン プロバイダーを使用してログインしているユーザーに関する情報を一時的に格納するのに Cookie を使用します
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // アプリケーションがベアラ トークンを使用してユーザーを認証できるようにします
            app.UseOAuthBearerTokens(OAuthOptions);
            OAuthAuthenticationConfiguratorManager.ConfigureOAuthentication(app);
        }
    }
}
