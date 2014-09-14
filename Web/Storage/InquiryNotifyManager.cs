using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;
using Web.Utility;

namespace Web.Storage
{
    [TableStorage("InquiryNotifyTo")]
    public class InquiryNotifyManager:AzureTableManagerBase<InquiryCCEntity>
    {
        public InquiryNotifyManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public static void SendInquiryNotification(string userName, string email, string content)
        {
            InquiryNotifyManager notifyManager=new InquiryNotifyManager(new TableStorageConnection());
            notifyManager.SendToAllSupporter(userName,email,content);
        }

        /// <summary>
        /// 通知先全員にメールで通知
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="email"></param>
        /// <param name="content"></param>
        public void SendToAllSupporter(string userName,string email,string content)
        {
            MailMessage mailMessage=new MailMessage();
            mailMessage.From=new MailAddress("admin@linophi.com","Administrator");
            foreach (var to in CreateQuery().Where(f => true))
            {
                mailMessage.To.Add(to.PartitionKey);
            }
            mailMessage.ReplyToList.Add(email);
            mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(
                string.Format("{0}様({1}より以下のお問い合わせを受け取りました。\n"+"{2}",userName,email,content), null,MediaTypeNames.Text.Plain));
            LinophiMailClient.Instance.SendMessage(mailMessage);
        }
    }

    [TableStorage("InquiryNotifyTo")]
    public class InquiryCCEntity:TableEntity
    {
        public InquiryCCEntity()
        {
            
        }

        public InquiryCCEntity(string mailAddr):base(mailAddr,IdGenerator.getId(5))
        {
            
        }

        public string Name { get; set; }
    }
}