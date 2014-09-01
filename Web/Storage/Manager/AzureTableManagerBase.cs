using System.IO;
using System.Reflection;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;

namespace Web.Storage.Manager
{
    public abstract class AzureTableManagerBase<T> where T : ITableEntity, new()
    {
        protected readonly TableStorageConnection Connection;

        protected readonly CloudTable Table;

        protected AzureTableManagerBase(TableStorageConnection connection,string suffix="")
        {
            Connection = connection;
            var storageAttribute = GetType().GetCustomAttribute<TableStorageAttribute>();
            if (storageAttribute != null)
            {
                Table = connection.TableClient.GetTableReference(storageAttribute.TableName+suffix);
                Table.CreateIfNotExists();
            }
            else
                throw new InvalidDataException("このクラスにはテーブル名を指定するAttributeを設置する必要があります");
        }

        protected TableQuery<T> CreateQuery()
        {
            return Table.CreateQuery<T>();
        }
    }
}