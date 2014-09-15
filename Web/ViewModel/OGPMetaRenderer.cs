using System.Web;
using System.Web.Mvc;

namespace Web.ViewModel
{
    public static class OGPMetaRenderer
    {
        public static IHtmlString RenderOGP(this HtmlHelper helper,IMetaBasicOGPViewModel meta)
        {
            MetaBuilder builder=new MetaBuilder();
            builder.Add("og:title",meta.Title);
            builder.Add("og:type",meta.Type);
            builder.Add("og:description",meta.Description);
            builder.Add("og:url",meta.Url);
            builder.Add("og:site_name",meta.SiteName);
            builder.Add("twitter:card","summary");
            builder.Add("twitter:site", "@linophi");
            builder.Add("twitter:title",meta.Title);
            builder.Add("twitter:description",meta.Description);
            builder.Add("twitter:image",meta.ImageUrl);
            builder.Add("twitter:url",meta.Url);
            return helper.Raw(builder.GetAsMetaTag());
        }
    }
}