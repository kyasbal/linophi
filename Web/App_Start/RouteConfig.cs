using System.Web.Mvc;
using System.Web.Routing;

namespace Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute("Account", "Account/{action}", new { controller = "Account" }
    );
            routes.MapRoute("RedirectToEdit", "RedirectToEdit", new { controller = "Edit", action = "RedirectToEdit", id = UrlParameter.Optional }
    );
            routes.MapRoute("Edit", "Edit", new {controller = "Edit", action = "Index", id = UrlParameter.Optional}
                );
            routes.MapRoute("Preview", "Preview", new {controller = "Edit", action = "Preview"});
            routes.MapRoute("Search", "Search", new { controller = "Home" ,action="Search"}
);
            routes.MapRoute("Tag", "Tag", new { controller = "Home", action = "Tag" }
);
            routes.MapRoute("Content", "Content/{action}", new { controller = "Content" }
);
            routes.MapRoute("UserPage", "UserPage", new { controller = "Home", action = "UserPage" }
);
            routes.MapRoute("MyPage", "MyPage", new { controller = "Home",action="MyPage" }
);
            routes.MapRoute("Default", "{id}", new {controller = "Home", action = "Index", id = UrlParameter.Optional}
                );
            routes.MapRoute("Pages", "Pages/{controller}/{action}/{id}",
                new {controller = "Home", action = "Index", id = UrlParameter.Optional}
                );
        }
    }
}
