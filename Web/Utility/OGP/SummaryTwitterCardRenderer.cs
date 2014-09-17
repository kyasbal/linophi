namespace Web.Utility.OGP
{
    public class SummaryTwitterCardRenderer : OGPRendererBase
    {
        public override string RenderOGPMeta(IOGPSiteMeta siteMeta, IOGPPageData ogpPageData)
        {
            ogpPageData = GetPageMetaMerger().MergeMetaData(ogpPageData, siteMeta);
            var metas = new MetaDictionary("twitter:");
            metas.Add("card","summary");
            if (siteMeta is ITwitterCardSiteMeta)
            {
                var twitterSiteMeta = (ITwitterCardSiteMeta)siteMeta;
                metas.Add("site",twitterSiteMeta.Site);
            }
            AppendTitleImageUrl(metas,ogpPageData);
            metas.Add("description", ogpPageData.Description);
            return metas.ToMetaTagString();
        }
    }
}