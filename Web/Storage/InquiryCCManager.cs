using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;
using Web.Utility;

namespace Web.Storage
{
    public class InquiryCCManager:AzureTableManagerBase<InquiryCCEntity>
    {
        public InquiryCCManager(TableStorageConnection connection, string suffix = "") : base(connection, suffix)
        {
        }

        /// <summary>
        /// 通知先全員にメールで通知
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="email"></param>
        /// <param name="content"></param>
        public void SendToAllCC(string userName,string email,string content)
        {
            
        }
    }

    [TableStorage("blob-inquiry-cc")]
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