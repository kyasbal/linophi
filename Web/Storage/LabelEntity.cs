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
using System.Web.UI.WebControls;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Web.Storage.Connection;
using Web.Storage.Manager;

namespace Web.Storage
{
    public class LabelKeyValuePair
    {
        public string Key { get; set; }

        public int Value { get; set; }
    }

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

        public IDictionary<string,int> GetData()
        {
            LabelKeyValuePair[] values=Json.Decode<LabelKeyValuePair[]>(LabelCountData);
            Dictionary<string,int> dict=new Dictionary<string, int>(); 
            foreach (var labelKeyValuePair in values)
            {
               dict.Add(labelKeyValuePair.Key,labelKeyValuePair.Value);
            }
            return dict;
        }

        public List<string> GetAddresses()
        {
            return Json.Decode<List<string>>(LabelHostAddress);
        }

        public void SaveData(IDictionary<string, int> data,IList<string> addresses)
        {
            this.LabelCountData = Json.Encode(data.OrderBy(f=>f.Value).Select(f=>new LabelKeyValuePair(){Key=f.Key,Value=f.Value}).ToArray());
            this.LabelHostAddress = Json.Encode(addresses);

        }
    }

    [TableStorage("Labels")]
    public class LabelTableManager:AzureTableManagerBase<LabelEntity>
    {
        public LabelTableManager(TableStorageConnection connection) : base(connection)
        {
        }

        public bool IncrementLabel(string articleId, string paragraphId, string address, string labelName, bool debugMode)
        {
            var ent = CreateQuery()
                .Where(f => f.PartitionKey.Equals(articleId) && f.RowKey.Equals(paragraphId)).FirstOrDefault();
            if (ent == null)
            {
                ent=new LabelEntity(articleId,paragraphId);
            }
            IList<string> addresses = ent.GetAddresses();
            if (!debugMode&&addresses.Contains(address)) return false;
            if(!debugMode)addresses.Add(address);
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
            var ent = CreateQuery().Where(f => f.PartitionKey.Equals(articleId)).Select(f => new{ParagraphId=f.RowKey,Data=f.LabelCountData }).ToArray();
            return Json.Encode(ent);
        }

        public async Task RemoveArticleLabelAsync(string articleId)
        {
            var ent = CreateQuery().Where(f => f.PartitionKey.Equals(articleId));
            foreach (var labelEntity in ent)
            {
                await Table.ExecuteAsync(TableOperation.Delete(labelEntity));
            }
        }
    }
}