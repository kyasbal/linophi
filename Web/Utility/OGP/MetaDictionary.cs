using System.Collections.Generic;
using System.Text;

namespace Web.Utility.OGP
{
    public class MetaDictionary : Dictionary<string, string>
    {
        private string prefix;

        public MetaDictionary(string prefix)
        {
            this.prefix = prefix;
        }

        public string ToMetaTagString()
        {
            StringBuilder builder=new StringBuilder();
            foreach (var meta in this)
            {
                builder.AppendFormat("<meta property=\"{0}\" content=\"{1}\" />\n",prefix+meta.Key,meta.Value);
            }
            return builder.ToString();
        }
    }
}