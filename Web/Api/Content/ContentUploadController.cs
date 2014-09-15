using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using Web.Storage;
using Web.Storage.Connection;
using Web.Storage.Topic;
using Web.Utility;

namespace Web.Api.Content
{
    public class ContentUploadController : Controller
    {
        public async Task<ActionResult> ServerCache(string url)
        {
            ImageUploaderManager manager=new ImageUploaderManager(new BlobStorageConnection());
            var st=await manager.AddUrlResourceAsync(url,false);
            return new ImageResult(st.Item1, st.Item2);
        }

        public async Task<ActionResult> LargeServerCache(string url)
        {
            ImageUploaderManager manager = new ImageUploaderManager(new BlobStorageConnection());
            var st = await manager.AddUrlResourceAsync(url,true);
            return new ImageResult(st.Item1, st.Item2);
        }

        [System.Web.Mvc.HttpGet]
        public async Task<ActionResult> Thumbnail(string articleId)
        {
            ArticleThumbnailManager manager=new ArticleThumbnailManager(new BlobStorageConnection());
            return new ImageResult(await manager.DownloadThumbnail(articleId), "image/jpeg");
        }

        [System.Web.Mvc.HttpGet]
        public async Task<ActionResult> TopicThumbnail(string topicId)
        {
            TopicThumbnailManager manager = new TopicThumbnailManager(new BlobStorageConnection());
            TopicThumbnailManager.GetTopicImageResult imageResult = await manager.getTopicImage(topicId);
            return new ImageResult(imageResult.ContentBody, imageResult.ContentType);
        }
    }
}
