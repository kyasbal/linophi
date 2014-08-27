using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Table;

namespace Web.Storage
{
    public class TableStorageConnection
    {
        public CloudStorageAccount StorageAccount { get; private set; }

        public CloudTableClient TableClient { get; private set; }

        public TableStorageConnection()
        {
            StorageAccount = CloudStorageAccount.DevelopmentStorageAccount;//new CloudStorageAccount(new StorageCredentials("Azure Storageのアカウント名", "Azure Storageのプライマリアクセスキー"), useHttps: false);//実際に運用するときにはuseHttpsはtrueにしたほうがいいのだろうか。
            TableClient = StorageAccount.CreateCloudTableClient();
        }
    }
}