using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Security.Application;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Utility;

namespace Web.Storage
{
    public class ArticleBodyEntity:TableEntity
    {
        public ArticleBodyEntity(string articleKey) : base(articleKey,"constant")
        {

        }

        public ArticleBodyEntity()
        {
        }

        public string Body { get; set; }
    }
    [AzureStorageTable("ArticleBody")]
    public class ArticleBodyTableManager : AzureTableManagerBase<ArticleBodyEntity>
    {
        public ArticleBodyTableManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public void AddArticle(string artickleKey, string body)
        {
            string safeHtml = Sanitizer.GetSafeHtmlFragment(body);
            _table.Execute(TableOperation.InsertOrReplace(new ArticleBodyEntity(artickleKey){Body = safeHtml}));
        }

        public void RemoveArticle(string articleKey)
        {
            _table.Execute(TableOperation.Delete(new ArticleBodyEntity(articleKey)));
        }

        public string GetArticleBody(string articleKey)
        {
            return CreateQuery().Where((m) => m.PartitionKey.Equals(articleKey)).FirstOrDefault().Body;
        }
    }
}