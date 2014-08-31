using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Threading;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace Web.Utility
{
    public static class WebPageStatic
    {
        public static IPrincipal User()
        {
            return Thread.CurrentPrincipal;
        }

        public static string GetUserNickName(HttpRequestBase req)
        {
            var um = req.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var account=um.FindByName(User().Identity.Name);
            return account.NickName;
        }
    }
}