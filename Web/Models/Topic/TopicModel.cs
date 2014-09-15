using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Web.Models.Topic
{
    public class TopicModel
    {
        [Key]
        /// <summary>
        /// トピックのID
        /// </summary>
        public string TopicId { get; set; }

        /// <summary>
        /// トピックのタイトル
        /// </summary>
        public string TopicTitle { get; set; }

        /// <summary>
        /// トピックの説明
        /// </summary>
        public string Description { get; set; }
    }
}