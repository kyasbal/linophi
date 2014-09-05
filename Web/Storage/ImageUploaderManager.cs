using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    [BlobStorage("uploaded-from-web")]
    public class ImageUploaderManager:AzureBlobManagerBase
    {
        private string[] whiteMIMEList = new[] {"image/gif","image/png","image/x-png","image/jpeg","image/x-bmp","image/x-ms-bmp"};

        private ImageUploaderQuantized quantizedManager;

        public ImageUploaderManager(BlobStorageConnection connection) : base(connection)
        {
            quantizedManager=new ImageUploaderQuantized(connection);
        }

        public Tuple<double, double> ClampSize(Bitmap source)
        {
            double w, h;
            double sw =w= source.Width, sh =h= source.Height;
            if (sw >= 660)
            {
                w = 660;
                h = sh*660/sw;
            }
            return new Tuple<double, double>(w,h);
        }

        public async Task<Tuple<Stream,string>> AddUrlResourceAsync(string url,bool needBig)
        {
            string contentType;
            var hash = ComputeMD5(url);
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(hash);
            if (blobRef.Exists())
            {
                MemoryStream ms2=new MemoryStream();
                if(needBig)
                {
                    await blobRef.DownloadToStreamAsync(ms2);
                }
                else
                {
                    await quantizedManager.DownloadToStream(ms2, hash);
                }
                
                ms2.Seek(0, SeekOrigin.Begin);
                contentType = blobRef.Properties.ContentType;
                return new Tuple<Stream, string>(ms2, contentType);
            }

            WebClient wc = new WebClient();
            Stream stream = wc.OpenRead(url);
            contentType=blobRef.Properties.ContentType = wc.ResponseHeaders["Content-Type"];
            if (!whiteMIMEList.Contains(contentType.ToLower())) return null;//これ以外で実行形式などがアップロードされないようにホワイトリスト
            await blobRef.UploadFromStreamAsync(stream);
            MemoryStream ms=new MemoryStream();
            await blobRef.DownloadToStreamAsync(ms);
            await ms.FlushAsync();
            ms.Seek(0, SeekOrigin.Begin);
            Bitmap sourceBitmap = new Bitmap(ms);
            var size = ClampSize(sourceBitmap);
            Bitmap resizedBitmap = ResizeImage(sourceBitmap, size.Item1, size.Item2);
            MemoryStream ms3=new MemoryStream();
            resizedBitmap.Save(ms3,ImageFormat.Jpeg);
            ms3.Seek(0, SeekOrigin.Begin);
            await quantizedManager.UploadResizedBlob(ms3,hash);
            ms3.Seek(0, SeekOrigin.Begin);
            return new Tuple<Stream, string>(ms3,"image/jpeg");
        }
        public static Bitmap ResizeImage(Bitmap image, double dw, double dh)
        {
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

        public Stream DownloadUrlResource(string url, out string contentType)
        {
            var hash = ComputeMD5(url);
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(hash);
            contentType = blobRef.Properties.ContentType;
            MemoryStream ms=new MemoryStream();
            blobRef.DownloadToStream(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            return ms;
        }

        private string ComputeMD5(string source)
        {
            //文字列をbyte型配列に変換する
            byte[] data = System.Text.Encoding.UTF8.GetBytes(source);

            //MD5CryptoServiceProviderオブジェクトを作成
            System.Security.Cryptography.MD5CryptoServiceProvider md5 =
                new System.Security.Cryptography.MD5CryptoServiceProvider();
            //または、次のようにもできる
            //System.Security.Cryptography.MD5 md5 =
            //    System.Security.Cryptography.MD5.Create();

            //ハッシュ値を計算する
            byte[] bs = md5.ComputeHash(data);

            //リソースを解放する
            md5.Clear();

            //byte型配列を16進数の文字列に変換
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            foreach (byte b in bs)
            {
                result.Append(b.ToString("x2"));
            }
            return result.ToString();
        }
    }

    [BlobStorage("upload-from-web-quantized")]
    public class ImageUploaderQuantized : AzureBlobManagerBase
    {
        public ImageUploaderQuantized(BlobStorageConnection connection) : base(connection)
        {
        }

        public async Task UploadResizedBlob(Stream stream, string hash)
        {
            var blobRef = Container.GetBlockBlobReference(hash);
            blobRef.Properties.ContentType = "image/jpeg";
            await blobRef.UploadFromStreamAsync(stream);
            await stream.FlushAsync();
        }

        public async Task DownloadToStream(Stream stream, string hash)
        {
            var blobRef = Container.GetBlockBlobReference(hash);
            await blobRef.DownloadToStreamAsync(stream);
            await stream.FlushAsync();
        }
    }
}