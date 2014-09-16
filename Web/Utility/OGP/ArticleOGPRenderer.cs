namespace Web.Utility.OGP
{
    public class ArticleOGPRenderer : OGPRendererBase
    {
        public override string RenderOGPMeta(IOGPSiteMeta siteMeta, IOGPPageData ogpPageData)
        {
            ogpPageData = GetPageMetaMerger().MergeMetaData( ogpPageData,siteMeta);
            var metas = new MetaDictionary("og:");
            metas.Add("type","article");
            metas.Add("site_name",siteMeta.SiteName);
            AppendTitleImageUrl(metas,ogpPageData);
            AppendOptionalMeta(metas,ogpPageData);
            return metas.ToMetaTagString();
        }
    }
}