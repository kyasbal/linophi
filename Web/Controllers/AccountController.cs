using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Web.Models;
using Web.Storage;
using Web.Utility;

namespace Web.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationUserManager _userManager;

        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        [AllowAnonymous]
        public ActionResult LogIn()
        {
            return View();
        }

        public ActionResult SignUp()
        {
            return View();
        }
        [AllowAnonymous]
        public ActionResult TestConfirmation()
        {
            return View("ExternalLoginConfirmation");
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult ExternalLogin(string provider,string returnUrl)
        {
            return new ChallengeResult(provider,Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {

            ExternalLoginInfo loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            //Owin Securityによって提供されるログイン状態の取得。
            if (loginInfo == null) //ログインできなかった場合?(認証トークンの取得失敗)
            {
                return RedirectToAction("Login"); //Loginのページに戻す。
            }

            // ユーザーが既にログインを持っている場合、この外部ログイン プロバイダーを使用してユーザーをサインインします
            UserAccount user = await UserManager.FindAsync(loginInfo.Login);
            if (user != null)
            {
                await SignInAsync(user, false);
                return Redirect(returnUrl);
            }
            // ユーザーがアカウントを持っていない場合、ユーザーにアカウントを作成するよう求めます
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
            //注)この瞬間に以下のコードはExternalLoginConfirmationアクションを呼び出しているのではない。
            //あくまでもビューをリターンしているに過ぎないことに注意。
            return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email }
                /*フォームのデフォルト値としてメールアドレスをセットするため。*/);
        }

        private async Task SignInAsync(UserAccount user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent },
                await user.GenerateUserIdentityAsync(UserManager));
        }

        private IAuthenticationManager AuthenticationManager
        {
            get { return HttpContext.GetOwinContext().Authentication; }
        }
    }

    public class ExternalLoginConfirmationViewModel
    {
        [Display(Name = "メールアドレス")]
        public string Email { get; set; }
        [Display(Name = "利用規約に同意する")]
        public bool AcceptTerm { get; set; }
        [Display(Name = "linophiの通知をメールで受け取る")]
        public bool AcceptMail { get; set; }
    }
}