using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Web.Utility;

namespace Web.Models.Topic
{
    public class TopicModel
    {
        public static TopicModel GenerateNewTopic()
        {
            TopicModel model=new TopicModel();
            model.TopicId = IdGenerator.getId(10);
            return model;
        }

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

        /// <summary>
        /// 炎上指数
        /// </summary>
        public double EvaluationOfFire { get; set; }

        /// <summary>
        /// 一般のユーザーに見えるかどうか
        /// </summary>
        public bool IsVisibleToAllUser { get; set; }
    }
}