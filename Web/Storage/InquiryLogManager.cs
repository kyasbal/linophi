using System;
using System.Collections.Generic;
using System.IdentityModel.Selectors;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;
using Web.Utility;

namespace Web.Storage
{
    [TableStorage("InquiryLog")]
    public class InquiryLogManager:AzureTableManagerBase<InquiryLogEntity>
    {
        public static async Task<string> LogInquiry(string userName,string email,string content)
        {
            InquiryLogManager manager = new InquiryLogManager(new TableStorageConnection());
            return await manager.AddLog(userName, email, content);  
        }

        public InquiryLogManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        public async Task<string> AddLog(string userName, string mail, string content)
        {
            var inquiryLog = new InquiryLogEntity(mail);
            inquiryLog.Name = userName;
            inquiryLog.Mail = mail;
            inquiryLog.Content = content;
            await Table.ExecuteAsync(TableOperation.Insert(inquiryLog));
            return inquiryLog.RowKey;
        }
    }

    public class InquiryLogEntity : TableEntity
    {
        public InquiryLogEntity()
        {
            
        }

        public InquiryLogEntity(string mail):base(mail,IdGenerator.getId(10))
        {
            
        }

        public string Name { get; set; }

        public string Mail { get; set; }

        public string Content { get; set; }
    }
}