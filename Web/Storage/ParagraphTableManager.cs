using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;

namespace Web.Storage
{
    [AzureStorageTable("Paragraphs")]
    public class ParagraphTableManager:AzureTableManagerBase<ParagraphEntity>
    {
        public ParagraphTableManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public void AddParagraph()
        {
            _table.Execute(TableOperation.Insert(new ParagraphEntity("TestArticle", 10, "TestParagraph")
            {
                NextParagraph = "nextTest",
                PrevParagraph = "prevTest",
                ParagraphIndex = 10,
                RawText = "RawRawRaw"
            }));
        }
    }
}