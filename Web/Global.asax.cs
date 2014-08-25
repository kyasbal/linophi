using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleTable.EnableOptimizations = true;
            BundleTable.Bundles.UseCdn = true;
            BundleTable.Bundles.Add(new StyleBundle("~/css/clear","http://yui.yahooapis.com/3.17.2/build/cssreset/cssreset-min.css"));
            BundleTable.Bundles.Add(new Bundle("~/js/common",new JsMinify()).Include("~/Scripts/jquery-2.1.1.js").Include("~/Scripts/collections.js"));
        }
    }
}
