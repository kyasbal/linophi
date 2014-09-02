using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Web.Utility;

namespace Web.Models
{
    public class ArticleModel
    {
        public static ArticleModel GenerateArticle(string title,string auther)
        {
            return new ArticleModel(){ArticleId = IdGenerator.getId(12),AuthorID = auther,Title = title,CreationTime = DateTime.Now,UpdateTime = DateTime.Now};
        }

        [Key]
        public string ArticleId { get; set; }

        public string Title { get; set; }

        public ICollection<ArticleTagModel> Tags { get; set; } 
        
        public string AuthorID { get; set; }

        public int PageView
        {
            get; set;
        }

        public int LabelCount { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }

    public class ArticleTagModel
    {
        public static ArticleTagModel GenerateTag(string tagName)
        {
            return new ArticleTagModel() {TagId = IdGenerator.getId(12), TagName = tagName};
        }

        [Key]
        public string TagId { get; set; }

        public string TagName { get; set; }
    }
}