using Microsoft.WindowsAzure.Storage.Blob;

namespace Web.Storage.Connection
{
    public class BlobStorageConnection : StorageConnectionBase
    {
        public CloudBlobClient BlobClient { get; private set; }

        public BlobStorageConnection()
        {
            BlobClient = StorageAccount.CreateCloudBlobClient();
        }
    }
}