using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI.WebControls;
using Microsoft.Security.Application;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;
using Web.Utility;

namespace Web.Storage
{

    [BlobStorage("blob-article-body")]
    public class ArticleBodyTableManager : AzureBlobManagerBase
    {
        public ArticleBodyTableManager(BlobStorageConnection connection):base(connection)
        {
        }

        public async Task AddArticle(string artickleKey, string body)
        {
            string safeHtml = Sanitizer.GetSafeHtmlFragment(body);
            ICloudBlob blob = Container.GetBlockBlobReference(artickleKey);
            var blobArray = Encoding.Unicode.GetBytes(safeHtml);
            await blob.UploadFromByteArrayAsync(blobArray,0,blobArray.Length);
        }

        public async Task RemoveArticle(string articleKey)
        {
            ICloudBlob blob = Container.GetBlockBlobReference(articleKey);
            if (!blob.Exists()) return;
            await blob.DeleteAsync();
        }

        public async Task<string> GetArticleBody(string articleKey)
        {
            ICloudBlob blob = Container.GetBlockBlobReference(articleKey);
            if (!blob.Exists())
            {
                return null;
            }
            using (MemoryStream ms=new MemoryStream())
            {
                await blob.DownloadToStreamAsync(ms);
                return Encoding.Unicode.GetString(ms.ToArray());
            }
        }
    }
}