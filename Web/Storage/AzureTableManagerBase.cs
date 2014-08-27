using System.IO;
using System.Reflection;
using Microsoft.WindowsAzure.Storage.Table;

namespace Web.Storage
{
    public abstract class AzureTableManagerBase<T> where T : ITableEntity, new()
    {
        protected readonly TableStorageConnection _connection;

        protected CloudTable _table;

        protected AzureTableManagerBase(TableStorageConnection connection,string suffix="")
        {
            _connection = connection;
            var storageAttribute = GetType().GetCustomAttribute<AzureStorageTableAttribute>();
            if (storageAttribute != null)
            {
                _table = connection.TableClient.GetTableReference(storageAttribute.TableName+suffix);
                _table.CreateIfNotExists();
            }
            else
                throw new InvalidDataException("このクラスにはテーブル名を指定するAttributeを設置する必要があります");
        }

        protected TableQuery<T> CreateQuery()
        {
            return _table.CreateQuery<T>();
        }
    }
}