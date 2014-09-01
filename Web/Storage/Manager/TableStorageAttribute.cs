using System;

namespace Web.Storage.Manager
{
    [AttributeUsage(AttributeTargets.Class)]
    public class TableStorageAttribute : Attribute
    {
        public TableStorageAttribute(string tableName)
        {
            TableName = tableName;
        }

        public string TableName { get; private set; }
    }
}