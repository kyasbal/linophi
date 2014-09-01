using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Models;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    [TableStorage("Paragraphs")]
    public class ParagraphTableManager:AzureTableManagerBase<ParagraphEntity>
    {
        public ParagraphTableManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public void AddParagraph(string articleId,int version,ParagraphDataModel paragraphDataModel)
        {
            Table.Execute(TableOperation.Insert(ParagraphEntity.FromDataModel(articleId, version, paragraphDataModel)));
        }

        public ParagraphEntity[] GetParagraphs(string articleId, int version)
        {
            string partition = articleId + "@" + version;
            return (from q in CreateQuery() where q.PartitionKey.Equals(partition) select q).ToArray();
        }
    }
}