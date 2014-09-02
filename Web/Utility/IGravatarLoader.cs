using System;
using System.Diagnostics;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;

namespace Web.Utility
{
    /// <summary>
    /// Gravatarのアイコン情報へのアクセスを提供するインターフェース
    /// </summary>
    public interface IGravatarLoader
    {
        /// <summary>
        /// アイコンが存在するかどうか
        /// </summary>
        /// <returns></returns>
        bool IsIconExisting();

        /// <summary>
        /// アイコンを表示する際のタグを取得します。
        /// </summary>
        /// <returns></returns>
        MvcHtmlString GetIconTag();

        /// <summary>
        /// アイコンを表示する際のタグを取得します。
        /// </summary>
        /// <param name="size">画像のサイズ(px)</param>
        /// <returns></returns>
        MvcHtmlString GetIconTag(int size);
    }

    public static class GravatarRazorHelper
    {
        public static MvcHtmlString GravatarImg(this HtmlHelper<dynamic> helper, HttpRequestBase req,int size=128)
        {
            var userManager = req.GetOwinContext().GetUserManager<ApplicationUserManager>();
            UserAccount user = userManager.FindByName(WebPageStatic.User().Identity.Name);
            if(user==null)return new MvcHtmlString("");
            BasicGravatarLoader loader=new BasicGravatarLoader(user.Email);
            return loader.GetIconTag(size);
        }
    }

     public class BasicGravatarLoader:IGravatarLoader
    {
        private const string GravatarHashAdder = "http://www.gravatar.com/avatar/{0}";
        private bool? _isExistingIcon;
        private readonly string _hashString;

        /// <summary>
        /// 標準的なGravatar用のクラスを取得する
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static BasicGravatarLoader GetBasicGravatarLoader(UserAccount user)
        {
            return new BasicGravatarLoader(user.Email);
        }

        public BasicGravatarLoader(String emailAddress)
        {
            string lowerEmailAddress = emailAddress.ToLower();
            _isExistingIcon = null;
            //MD5ハッシュの生成
            var md5 = new MD5CryptoServiceProvider();
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(lowerEmailAddress));
            md5.Clear();
            _hashString = hash.ToHexString();
        }

        public bool IsIconExisting()
        {
            if (_isExistingIcon != null) return (bool)_isExistingIcon;
            //リクエストパラメータ
            var requestUrl = String.Format(GravatarHashAdder+"?d=404",_hashString)
                ;
            Trace.WriteLine("Gravatar Icon:"+requestUrl);
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(requestUrl);

            return (bool) (_isExistingIcon = ((int) req.GetStatusCode() < 400));//サーバーエラーや404ならば存在しないとみなす
        }

        private MvcHtmlString GenerateTag(string param)
        {
            if(!param.IsNullOrEmpty())param = "?"+param;
            return MvcHtmlString.Create(String.Format("<img src=\""+GravatarHashAdder+"{1}\" />", _hashString,param));
        }

        public MvcHtmlString GetIconTag()
        {
            return GenerateTag(null);
        }

        public MvcHtmlString GetIconTag(int size)
        {
            size = MathEx.Clamp(1, 2048, size);//Gravatarの仕様上1px～2048px
            return GenerateTag(String.Format("s={0}", size));
        }
    }
}
