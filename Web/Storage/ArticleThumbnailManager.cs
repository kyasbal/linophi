using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.WindowsAzure.Storage.Blob;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    [BlobStorage("blob-web-thumbnails")]
    public class ArticleThumbnailManager:AzureBlobManagerBase
    {
        public ArticleThumbnailManager(BlobStorageConnection connection) : base(connection)
        {
        }

        public Task UploadThumbnail(string articleId, HttpPostedFileBase file)
        {
            return Task.Run(() =>
            {
                if(file==null)return;
                CloudBlockBlob blobRef = Container.GetBlockBlobReference(articleId);
                Bitmap bmp=new Bitmap(file.InputStream);
                Bitmap resizedImage = ResizeImage(bmp);
                blobRef.Properties.ContentType = "image/jpeg";
                    using (MemoryStream ms = new MemoryStream())
                    {
                        resizedImage.Save(ms, ImageFormat.Jpeg);
                        ms.Seek(0, SeekOrigin.Begin);
                        blobRef.UploadFromStream(ms);
                    }
                });
        }

        public bool CheckThumbnailExist(string articleId)
        {
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(articleId);
            return blobRef.Exists();
        }

        public string GenerateThumnailTag(string articleId)
        {
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(articleId);
            if (!blobRef.Exists())
            {
                return "";
            }
            else
            {
                return String.Format("<img src='/Pages/ContentUpload/Thumbnail?articleId={0}' class='thumbnail'/>",articleId);
            }
        }

        public async Task<Stream> DownloadThumbnail(string articleId)
        {
            MemoryStream ms=new MemoryStream();
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(articleId);
            await blobRef.DownloadToStreamAsync(ms);
            ms.Seek(0, SeekOrigin.Begin);
            return ms;
        }

        public static Bitmap ResizeImage(Bitmap image)
        {
            const double dw = 256;
            const double dh = 256;
            double hi;
            double imagew = image.Width;
            double imageh = image.Height;

            if ((dh / dw) <= (imageh / imagew))
            {
                hi = dh / imageh;
            }
            else
            {
                hi = dw / imagew;
            }
            int w = (int)(imagew * hi);
            int h = (int)(imageh * hi);

            Bitmap result = new Bitmap(w, h);
            Graphics g = Graphics.FromImage(result);
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.DrawImage(image, 0, 0, result.Width, result.Height);

            return result;
        }

        public async Task RemoveThumbnail(string articleId)
        {
            ICloudBlob blobRef = Container.GetBlockBlobReference(articleId);
            await blobRef.DeleteIfExistsAsync();
        }
    }
}