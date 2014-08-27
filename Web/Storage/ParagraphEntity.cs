using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Models;

namespace Web.Storage
{
    public class ParagraphEntity:TableEntity
    {
        public ParagraphEntity(string articleId, int version, string paragraphId):base(articleId+"@"+version,paragraphId)
        {

        }

        public ParagraphEntity()
        {
        }

        public string NextParagraph { get; set; }

        public string PrevParagraph { get; set; }

        public int ParagraphIndex { get; set; }

        public string RawText { get; set; }

        public static ITableEntity FromDataModel(string articleId,int version,ParagraphDataModel paragraphDataModel)
        {
            return new ParagraphEntity(articleId,version,paragraphDataModel.id)
            {
                NextParagraph = paragraphDataModel.nextParagraph,
                PrevParagraph = paragraphDataModel.prevParagraph,
                RawText = paragraphDataModel.rawText,
                ParagraphIndex = paragraphDataModel.paragraphIndex
            };
        }
    }
}