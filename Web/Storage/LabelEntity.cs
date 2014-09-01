using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;

namespace Web.Storage
{
    public class LabelEntity:TableEntity
    {
        public LabelEntity()
        {
        }

        public LabelEntity(string articleId,string paragraphId,int labelType) : base(articleId,paragraphId+"@"+labelType)
        {
        }

        public int Count { get; set; }


    }
}