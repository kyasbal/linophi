using System;
using System.Linq;

namespace Web.ViewModel
{
    public class OGPViewModelBase:IMetaBasicOGPViewModel
    {
        public OGPViewModelBase(string title, string description, string imageUrl, string url, string type, string siteName)
        {
            _title = title;
            _description = description;
            _imageUrl = imageUrl;
            _url = url;
            _type = type;
            _siteName = siteName;
        }

        private string _title;
        private string _description;
        private string _siteName;
        private string _imageUrl;
        private string _url;
        private string _type;

        string IMetaBasicOGPViewModel.Title
        {
            get { return _title; }
        }

        string IMetaBasicOGPViewModel.Description
        {
            get { return _description; }
        }

        string IMetaBasicOGPViewModel.SiteName
        {
            get { return _siteName; }
        }

        string IMetaBasicOGPViewModel.ImageUrl
        {
            get { return _imageUrl; }
        }

        string IMetaBasicOGPViewModel.Url
        {
            get { return _url; }
        }

        string IMetaBasicOGPViewModel.Type
        {
            get { return _type; }
        }
    }
}