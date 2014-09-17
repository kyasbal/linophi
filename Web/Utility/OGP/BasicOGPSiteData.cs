namespace Web.Utility.OGP
{
    class BasicOGPSiteMeta : IOGPSiteMeta
    {
        private string _siteName;
        private string _defaultImage;
        private string _defaultLocale;

        public BasicOGPSiteMeta(string siteName, string defaultImage, string defaultLocale)
        {
            _siteName = siteName;
            _defaultImage = defaultImage;
            _defaultLocale = defaultLocale;
        }

        public string SiteName
        {
            get { return _siteName; }
        }

        public string DefaultImage
        {
            get { return _defaultImage; }
        }

        public string DefaultLocale
        {
            get { return _defaultLocale; }
        }
    }

    class BasicTwitterCardSiteMeta:BasicOGPSiteMeta,ITwitterCardSiteMeta
    {
        private string _site;

        public BasicTwitterCardSiteMeta(string siteName, string defaultImage, string defaultLocale, string site) : base(siteName, defaultImage, defaultLocale)
        {
            _site = site;
        }

        public string Site
        {
            get { return _site; }
        }
    }
}