using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            StorageAccount =
                new CloudStorageAccount(new StorageCredentials("linophi", "v2SuurJ84CZmi95smIAktNaHUSGvhAuBq8T78Rr46fR9xZC7xLFWDT3/HWoYTBby8qzVbAd1Ez8p1K7mcPNfvA=="),
                    useHttps: false); //実際に運用するときにはuseHttpsはtrueにしたほうがいいのだろうか。
            //SetDevelopmentStorageAccount();
            TableClient = StorageAccount.CreateCloudTableClient();
        }

        [Conditional("DEBUG")]
        private void SetDevelopmentStorageAccount()
        {
            StorageAccount = CloudStorageAccount.DevelopmentStorageAccount;
        }
    }
}