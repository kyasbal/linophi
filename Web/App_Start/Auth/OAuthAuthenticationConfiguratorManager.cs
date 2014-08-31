using System.Collections.Generic;
using Microsoft.Owin;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.Twitter;
using Owin;
using Web.Utility.Configuration;

namespace Web.Auth
{
    public static class OAuthAuthenticationConfiguratorManager
    {
        public static void ConfigureOAuthentication(IAppBuilder app)
        {
            List<IOAuthAuthenticationConfigurator> configurators =new List<IOAuthAuthenticationConfigurator>()
            {
                new OAuthAuthenticationConfiguratorBase.TwitterOAuthAuthenticationConfigurator(), 
                new OAuthAuthenticationConfiguratorBase.FacebookOAuthAuthenticationConfigurator(), 
/*                new OAuthAuthenticationConfiguratorBase.GoogleOAuthAuthenticationConfigurator(),
                new OAuthAuthenticationConfiguratorBase.YahooJpnOAuthAuthenticationConfigurator(),
                new OAuthAuthenticationConfiguratorBase.GithubOAuthAuthenticationConfigurator(),
                new OAuthAuthenticationConfiguratorBase.MicrosoftOAuthAuthenticationConfigurator()*/
            };
            configurators.ForEach((configurator)=>configurator.ConfigureAuth(app));
        }

        private interface IOAuthAuthenticationConfigurator
        {
            void ConfigureAuth(IAppBuilder app);
        }

        private abstract class OAuthAuthenticationConfiguratorBase:IOAuthAuthenticationConfigurator
        {
            protected IConfigurationLoader ConfigurationLoader=ConfigurationLoaderFactory.GetConfigurationLoader();
            
            public abstract void ConfigureAuth(IAppBuilder app);

            /// <summary>
            /// Twitterのログイン認証
            /// </summary>
            public class TwitterOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
            {
                public override void ConfigureAuth(IAppBuilder app)
                {
                   TwitterAuthenticationOptions opt=new TwitterAuthenticationOptions()
                   {
                       ConsumerKey = ConfigurationLoader.GetConfiguration("Twitter-ConsumerKey"),
                       ConsumerSecret =  ConfigurationLoader.GetConfiguration("Twitter-ConsumerSecret")
                   };
                    app.UseTwitterAuthentication(opt);
                }
            }

            /// <summary>
            /// フェイスブックのログイン認証
            /// </summary>
            public class FacebookOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
            {
                public override void ConfigureAuth(IAppBuilder app)
                {
                    FacebookAuthenticationOptions opt=new FacebookAuthenticationOptions()
                    {
                        AppId = ConfigurationLoader.GetConfiguration("Facebook-AppID"),
                        AppSecret = ConfigurationLoader.GetConfiguration("Facebook-AppSecret")
                    };
                    opt.Scope.Add("email");
                    app.UseFacebookAuthentication(opt);
                }
            }

//            /// <summary>
//            /// Googleのログイン認証
//            /// </summary>
//            public class GoogleOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
//            {
//                public override void ConfigureAuth(IAppBuilder app)
//                {
//                    app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
//                    {
//                        ClientId = ConfigurationLoader.GetConfiguration("Google-ClientId"),
//                        ClientSecret = ConfigurationLoader.GetConfiguration("Google-ClientSecret"),
//                        CallbackPath = new PathString("/Account/ExternalLoginCallbackForGoogle")
//                    });
//                }
//            }
//
//            /// <summary>
//            /// YahooJapanのログイン認証
//            /// </summary>
//            public class YahooJpnOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
//            {
//                public override void ConfigureAuth(IAppBuilder app)
//                {
//                    app.UseYahooAuthentication(new YahooJpnOAuth2AuthenticationOptions()
//                    {
//                        ClientId = ConfigurationLoader.GetConfiguration("YahooJpn-AppID"),
//                        ClientSecret = ConfigurationLoader.GetConfiguration("YahooJpn-AppSecret"),
//                        CallbackPath = new PathString("/Account/ExternalLoginCallbackForYahoo")
//                    });
//                }
//            }
//
//            /// <summary>
//            /// Githubのログイン認証
//            /// </summary>
//            public class GithubOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
//            {
//                public override void ConfigureAuth(IAppBuilder app)
//                {
//                    app.UseGithubAuthentication(new GithubAuthenticationOptions()
//                    {
//                        ClientId = ConfigurationLoader.GetConfiguration("Github-ClientID"),
//                        ClientSecret =ConfigurationLoader.GetConfiguration("Github-ClientSecret"),
//                        CallbackPath = new PathString("/Account/ExternalLoginCallbackForGithub")
//                    });
//                }
//            }
//
//            public class MicrosoftOAuthAuthenticationConfigurator:OAuthAuthenticationConfiguratorBase
//            {
//                public override void ConfigureAuth(IAppBuilder app)
//                {
//                    app.UseMicrosoftAccountAuthentication(new MicrosoftAccountAuthenticationOptions()
//                    {
//                        ClientId = ConfigurationLoader.GetConfiguration("Microsoft-ClientID"),
//                        ClientSecret = ConfigurationLoader.GetConfiguration("Microsoft-ClientSecret"),
//                        CallbackPath = new PathString("/Account/ExternalLoginCallbackForMicrosoft")
//                    });
//                }
//            }
        }
    }
}
