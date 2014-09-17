namespace Web.Utility.OGP
{
    class BasicOGPPageData : IOGPPageData
    {
        private string _title;
        private string _description;
        private string _image;
        private string _url;
        private string _locale;

        public BasicOGPPageData(string title, string description, string image, string url, string locale)
        {
            _title = title;
            _description = description;
            _image = image;
            _url = url;
            _locale = locale;
        }

        public BasicOGPPageData(string title, string description, string image, string url)
        {
            _title = title;
            _description = description;
            _image = image;
            _url = url;
        }

        public BasicOGPPageData(string title, string description, string url)
        {
            _title = title;
            _description = description;
            _url = url;
        }

        public string Title
        {
            get { return _title; }
        }

        public string Description
        {
            get { return _description; }
        }

        public string Image
        {
            get { return _image; }
        }

        public string Url
        {
            get { return _url; }
        }

        public string Locale
        {
            get { return _locale; }
        }
    }
}