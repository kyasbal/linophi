namespace Web.Utility.OGP
{
    public interface IOGPSiteMetaPageMetaMerger
    {
        IOGPPageData MergeMetaData(IOGPPageData page,IOGPSiteMeta site);
    }
}