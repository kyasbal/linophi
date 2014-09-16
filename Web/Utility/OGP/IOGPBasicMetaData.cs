using System;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Web.Utility.OGP
{
    interface ITwitterCardSiteMeta:IOGPSiteMeta
    {
        /// <summary>
        /// Twitterのユーザー名もしくはサイト
        /// </summary>
         string Site { get; }
    }

    public interface IOGPRenderer
    {
        string RenderOGPMeta(IOGPSiteMeta siteMeta, IOGPPageData ogpPageData);
    }

    public abstract class OGPRendererBase:IOGPRenderer
    {
        protected virtual IOGPSiteMetaPageMetaMerger GetPageMetaMerger()
        {
            return new BasicOGPSiteMetaPageMetaMerger();
        }

        public abstract string RenderOGPMeta(IOGPSiteMeta siteMeta, IOGPPageData ogpPageData);

        protected void AppendTitleImageUrl(MetaDictionary dic, IOGPPageData page)
        {
            dic.Add("title",page.Title);
            dic.Add("image",page.Image);
            dic.Add("url",page.Url);
        }

        protected void AppendOptionalMeta(MetaDictionary dic, IOGPPageData page)
        {
            dic.Add("description",page.Description);
            dic.Add("locale",page.Locale);
        }
    }


    public class BasicOGPDataBuilder
    {
        protected virtual IOGPSiteMeta GetOGPSiteMeta()
        {
            Assembly asm = Assembly.GetExecutingAssembly();
            string siteName = asm.GetOGPMeta<OGPSiteNameAttribute>();
            string locale = asm.GetOGPMeta<OGPDefaultLocaleAttribute>();
            string image = asm.GetOGPMeta<OGPDefaultImageAttribute>();
            string twitterUser = asm.GetOGPMeta<TwitterCardSiteAttribute>();
            BasicOGPSiteMeta siteMeta=new BasicTwitterCardSiteMeta(siteName,image,locale,twitterUser);
            return siteMeta;
        }

        public MvcHtmlString RenderMetaData(IOGPPageData pageData,params IOGPRenderer[] renderer)
        {
            var siteOgpData = GetOGPSiteMeta();
            StringBuilder builder=new StringBuilder();
            foreach (var ogpRenderer in renderer)
            {
                builder.AppendLine(ogpRenderer.RenderOGPMeta(siteOgpData, pageData));
            }
            return new MvcHtmlString(builder.ToString());
        }
    }

    public interface IOGPSupportedViewModel
    {
        IOGPPageData PageData { get; }

        IOGPRenderer[] Renderers { get; }

        MvcHtmlString OGPMetaTag { get; }
    }

    public abstract class BasicOGPSupportedViewModel:IOGPSupportedViewModel
    {
        private HttpRequestBase request;
        private MvcHtmlString _getOGPMetaTag;

        protected BasicOGPSupportedViewModel(HttpRequestBase request)
        {
            this.request = request;
        }

        protected virtual IOGPPageData GenerateOGPPageData()
        {
            string title = null;
            string description = null;
            string image = null;
            GetOGPPageData(out title,out description,out image);
            return new BasicOGPPageData(title,description,image,GetUrl());
        }

        protected virtual string GetUrl()
        {
            if (request == null) return "";
            return request.Url.ToString();
        }

        protected abstract void GetOGPPageData(out string title, out string description, out string image);

        public IOGPPageData PageData
        {
            get { return GenerateOGPPageData(); }
        }

        public virtual IOGPRenderer[] Renderers
        {
            get { return new IOGPRenderer[]{new ArticleOGPRenderer(), new SummaryTwitterCardRenderer()}; }
        }

        public MvcHtmlString OGPMetaTag
        {
            get
            {
                BasicOGPDataBuilder builder=new BasicOGPDataBuilder();
                return builder.RenderMetaData(PageData, Renderers);
            }
        }
    }
}
