using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Web.Utility;

namespace Web.Models
{
    public class ArticleModel
    {
        public ArticleModel()
        {
            Tags=new HashSet<ArticleTagModel>();
        }
        public static ArticleModel GenerateArticle(string title,string auther)
        {
            return new ArticleModel(){ArticleModelId = IdGenerator.getId(12),AuthorID = auther,Title = title,CreationTime = DateTime.Now,UpdateTime = DateTime.Now,Tags= new Collection<ArticleTagModel>()};
        }

        [Key]
        public string ArticleModelId { get; set; }
        public string Title { get; set; }
        public string AuthorID { get; set; }

        public int PageView
        {
            get; set;
        }

        public ICollection<ArticleTagModel> Tags { get; set; }

        public int LabelCount { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public bool IsDraft { get; set; }

        public string ThemeId { get; set; }

        public string RelatedArticleId { get; set; }
    }

    public class ArticleTagModel
    {
        public ArticleTagModel()
        {
            Articles=new HashSet<ArticleModel>();
        }
        public static ArticleTagModel GenerateTag(string tagName)
        {
            return new ArticleTagModel() {ArticleTagModelId =  IdGenerator.getId(12), TagName = tagName};
        }

        [Key]
        public string ArticleTagModelId { get; set; }

        public ICollection<ArticleModel> Articles { get; set; } 

        public string TagName { get; set; }
    }
}