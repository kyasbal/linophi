using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    public class LabelEntity:TableEntity
    {

        public LabelEntity()
        {
        }

        public LabelEntity(string articleId,string paragraphId) : base(articleId,paragraphId)
        {
            LabelCountData = "";
            SaveData(new Dictionary<string, int>(),new List<string>());
        }

        public string LabelCountData { get; set; }

        public string LabelHostAddress { get; set; }

        public IDictionary<string, int> GetData()
        {
            var serializer = new DataContractJsonSerializer(typeof (IDictionary<string, int>));
            using (MemoryStream ms=new MemoryStream(Encoding.UTF8.GetBytes(LabelCountData)))
            {
                return (IDictionary<string, int>) serializer.ReadObject(ms);
            }
        }

        public List<string> GetAddresses()
        {
            var serializer = new DataContractJsonSerializer(typeof(List<string>));
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(LabelHostAddress)))
            {
                return (List<string>) serializer.ReadObject(ms);
            }
        }

        public void SaveData(IDictionary<string, int> data,IList<string> addresses)
        {
            var serializer = new DataContractJsonSerializer(typeof(IDictionary<string, int>));
            using (MemoryStream ms = new MemoryStream())
            using (StreamReader reader=new StreamReader(ms))
            {
                serializer.WriteObject(ms,data);
                ms.Seek(0, SeekOrigin.Begin);
                this.LabelCountData = reader.ReadToEnd();
            }
            serializer = new DataContractJsonSerializer(typeof(IList<string>));
            using (MemoryStream ms = new MemoryStream())
            using (StreamReader reader = new StreamReader(ms))
            {
                serializer.WriteObject(ms, addresses);
                ms.Seek(0, SeekOrigin.Begin);
                this.LabelHostAddress = reader.ReadToEnd();
            }
            
        }
    }

    [TableStorage("Labels")]
    public class LabelTableManager:AzureTableManagerBase<LabelEntity>
    {
        public LabelTableManager(TableStorageConnection connection) : base(connection)
        {
        }

        public bool IncrementLabel(string articleId,string paragraphId,string address,string labelName)
        {
            var ent = CreateQuery()
                .Where(f => f.PartitionKey.Equals(articleId) && f.RowKey.Equals(paragraphId)).FirstOrDefault();
            if (ent == null)
            {
                ent=new LabelEntity(articleId,paragraphId);
            }
            IList<string> addresses = ent.GetAddresses();
            if (addresses.Contains(address)) return false;
            addresses.Add(address);
            IDictionary<string, int> dict = ent.GetData();
            if (!dict.ContainsKey(labelName))
            {
                dict.Add(labelName,0);
            }
            dict[labelName]++;
            ent.SaveData(dict,addresses);
            Table.Execute(TableOperation.InsertOrReplace(ent));
            return true;
        }

        public string GetLabelsJson(string articleId)
        {
            var ent = CreateQuery().Where(f => f.PartitionKey.Equals(articleId)).Select(f => new{f.RowKey,f.LabelCountData }).ToArray();
            return Json.Encode(ent);
        }
    }
}