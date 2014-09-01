using Microsoft.WindowsAzure.Storage.Table;

namespace Web.Storage.Connection
{
    public class TableStorageConnection : StorageConnectionBase
    {
        public CloudTableClient TableClient { get; private set; }

        public TableStorageConnection()
        {

            TableClient = StorageAccount.CreateCloudTableClient();
        }
    }


    
}