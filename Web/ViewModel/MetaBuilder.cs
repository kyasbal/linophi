using System.Collections.Generic;
using System.Text;

namespace Web.ViewModel
{
    public class MetaBuilder : Dictionary<string, string>
    {
        public string GetAsMetaTag()
        {
            StringBuilder builder=new StringBuilder();
            foreach (var pair in this)
            {
                builder.AppendFormat("<meta property=\"{0}\" content=\"{1}\"/>", pair.Key, pair.Value);
            }
            return builder.ToString();
        }
    }
}