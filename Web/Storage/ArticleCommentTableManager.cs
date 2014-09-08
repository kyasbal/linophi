using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;
using Web.Utility;

namespace Web.Storage
{
    public class ArticleComment : TableEntity
    {
        public ArticleComment()
        {
            
        }

        public ArticleComment(string articleId,string paragraphId,string userName,string IpAddr,string Comment):base(articleId,IdGenerator.getId(10))
        {
            CreationTime = DateTime.Now;
            if (string.IsNullOrWhiteSpace(userName))
            {
                this.AutoID = IdGenerator.getCommentId(userName, CreationTime);
            }
            else
            {
                this.AutoID = IdGenerator.getCommentId(IpAddr, CreationTime);
            }
            this.Comment = Comment;
            this.UserName = userName;
            this.ParagraphId = paragraphId;
        }
        public string ParagraphId { get; set; }

        public string UserName { get; set; }

        public DateTime CreationTime { get; set; }

        public string Comment { get; set; }

        public string AutoID { get; set; }
    }

    public class ArticleCommentViewModel
    {
        public string Comment { get; set; }

        public string PostTime { get; set; }

        public string AutoId { get; set; }

        public string Name { get; set; }
        public string ParagraphId { get; set; }
    }

    [TableStorage("Comments")]
    public class ArticleCommentTableManager:AzureTableManagerBase<ArticleComment>
    {
        public ArticleCommentTableManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public async Task AddComment(ArticleComment comment)
        {
            TableOperation operation = TableOperation.Insert(comment);
            await Table.ExecuteAsync(operation);
        }

        public IEnumerable<ArticleComment> GetComments(string articleId)
        {
            return CreateQuery().Where(f => f.PartitionKey.Equals(articleId));
        }

        public string GetCommentsAsJson(string articleId,out int count)
        {
            List<ArticleCommentViewModel> comments=new List<ArticleCommentViewModel>();
            foreach (var comment in GetComments(articleId))
            {
                comments.Add(new ArticleCommentViewModel()
                {
                    ParagraphId=comment.ParagraphId,
                    AutoId = comment.AutoID,
                    Comment = comment.Comment,
                    Name = comment.UserName,
                    PostTime = comment.CreationTime.ToShortDateString()
                });
            }
            count = comments.Count;
            return Json.Encode(comments.ToArray());
        }
    }
}