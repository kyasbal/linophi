using System;

namespace Web.Storage
{
    [AttributeUsage(AttributeTargets.Class)]
    public class AzureStorageTableAttribute : Attribute
    {
        public AzureStorageTableAttribute(string tableName)
        {
            TableName = tableName;
        }

        public string TableName { get; private set; }
    }
}