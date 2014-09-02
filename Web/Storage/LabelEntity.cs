using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Threading.Tasks;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    public class LabelEntity:TableEntity
    {
        public static string getRowKey(string paragraphId,string labelType)
        {
            return paragraphId + "@" + labelType;
        }

        public LabelEntity()
        {
        }

        public LabelEntity(string articleId,string paragraphId,string labelType) : base(articleId,getRowKey(paragraphId,labelType))
        {
        }

        public int Count { get; set; }
    }

    [TableStorage("Labels")]
    public class LabelTableManager:AzureTableManagerBase<LabelEntity>
    {
        public LabelTableManager(TableStorageConnection connection) : base(connection)
        {
        }

        public void IncrementLabel(string articleId, string paragraphId, string emotion)
        {
            LabelEntity entity=null;
            var queried=from label in CreateQuery() where label.PartitionKey.Equals(articleId)&&label.RowKey.Equals(LabelEntity.getRowKey(paragraphId,emotion)) select label;
            if (queried.Any())
            {
                entity = queried.First();
            }
            else
            {
                entity=new LabelEntity(articleId,paragraphId,emotion);
            }
            entity.Count++;
            Table.Execute(TableOperation.InsertOrReplace(entity));
        }
        
    }
}