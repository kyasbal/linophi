namespace Web.Utility.OGP
{
    public class BasicOGPSiteMetaPageMetaMerger : IOGPSiteMetaPageMetaMerger
    {
        public IOGPPageData MergeMetaData(IOGPPageData page, IOGPSiteMeta site)
        {
            string locale = page.Locale ?? site.DefaultLocale;
            string image = page.Image ?? site.DefaultImage;
            return new BasicOGPPageData(page.Title,page.Description,image,page.Url,locale);
        }
    }
}