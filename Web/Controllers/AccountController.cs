using System.Web.Mvc;
using Web.Models;
using Web.Storage;

namespace Web.Controllers
{
    public class AccountController : Controller
    {
        public ActionResult LogIn()
        {
            return View();
        }

        public ActionResult SignUp()
        {
            return View();
        }
    }
}