using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Security.Application;
using Microsoft.WindowsAzure.Storage.Blob;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    [BlobStorage("blob-article-markup")]
    public class ArticleMarkupTableManager : AzureBlobManagerBase
    {
        public ArticleMarkupTableManager(BlobStorageConnection connection) : base(connection)
        {
        }

        public async Task AddMarkupAsync(string articleKey,string markup)
        {
            ICloudBlob blob = Container.GetBlockBlobReference(articleKey);
            var blobArray = Encoding.Unicode.GetBytes(markup);
            await blob.UploadFromByteArrayAsync(blobArray, 0, blobArray.Length);
        }

        public async Task<string> GetArticleBodyAsync(string articleKey)
        {
            ICloudBlob blob = Container.GetBlockBlobReference(articleKey);
            if (!blob.Exists())
            {
                return null;
            }
            using (MemoryStream ms = new MemoryStream())
            {
                await blob.DownloadToStreamAsync(ms);
                return Encoding.Unicode.GetString(ms.ToArray());
            }
        }

        public async Task RemoveArticle(string articleId)
        {
            ICloudBlob blob = Container.GetBlockBlobReference(articleId);
            if (!blob.Exists()) return;
            await blob.DeleteAsync();
        }
    }
}