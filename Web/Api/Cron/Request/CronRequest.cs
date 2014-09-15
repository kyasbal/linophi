using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Api.Cron.Request
{
    public class CronRequest
    {
        public string Key { get; set; }

        public static bool IsCronRequest(CronRequest req)
        {
            return req.Key.Equals("9AB21015-A590-4D9C-8927-337D0354A0B9");
        }
    }
}