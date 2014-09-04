using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
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

        public ImageUploaderManager(BlobStorageConnection connection) : base(connection)
        {
        }

        public Stream AddUrlResource(string url, out string contentType)
        {
            WebClient wc = new WebClient();
            Stream stream = wc.OpenRead(url);
            var hash = ComputeMD5(url);
            CloudBlockBlob blobRef = Container.GetBlockBlobReference(hash);
            contentType=blobRef.Properties.ContentType = wc.ResponseHeaders["Content-Type"];
            if (!whiteMIMEList.Contains(contentType.ToLower())) return null;//これ以外で実行形式などがアップロードされないようにホワイトリスト
            blobRef.UploadFromStream(stream);
            ICloudBlob dlBlob = Container.GetBlobReferenceFromServer(hash);
            MemoryStream ms=new MemoryStream();
            dlBlob.DownloadToStream(ms);
            ms.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            return ms;
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
}