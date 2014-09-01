using System.IO;
using System.Reflection;
using Microsoft.WindowsAzure.Storage.Blob;
using Web.Storage.Connection;

namespace Web.Storage.Manager
{
    public class AzureBlobManagerBase
    {
        private readonly BlobStorageConnection _connection;
        protected readonly CloudBlobContainer Container;

        public AzureBlobManagerBase(BlobStorageConnection connection)
        {
            _connection = connection;
            var storageAttribute = GetType().GetCustomAttribute<BlobStorageAttribute>();
            if (storageAttribute != null)
            {
                Container = connection.BlobClient.GetContainerReference(storageAttribute.ContainerName);
                Container.CreateIfNotExists();
            }
            else
                throw new InvalidDataException("このクラスにはテーブル名を指定するAttributeを設置する必要があります");
        }
    }
}