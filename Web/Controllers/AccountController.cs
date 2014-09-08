using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Microsoft.Ajax.Utilities;
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

        [HttpGet]
        [AllowAnonymous]
        public ActionResult LogIn(string returnUrl)
        {
            if (User.Identity.IsAuthenticated) return Redirect("/");
            returnUrl = returnUrl ?? "/";
            return View((object)returnUrl);
        }
        [Authorize]
        [HttpGet]
        public ActionResult Logout()
        {
            AuthenticationManager.SignOut();
            return View();
        }

        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult> Config()
        {
            UserAccount user =await UserManager.FindByNameAsync(User.Identity.Name);
            return View(new AccountConfigViewModel()
            {
                MailMagazine = user.AcceptEmail,
                NickName = user.NickName,
            });
        }

        [ValidateAntiForgeryToken]
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Config(AccountConfigViewModel vm)
        {
            UserAccount user = await UserManager.FindByNameAsync(User.Identity.Name);
            user.NickName = vm.NickName;
            user.AcceptEmail = vm.MailMagazine;
            user.UpdateTime=DateTime.Now;
            await UserManager.UpdateAsync(user);
            return RedirectToAction("Config");
        }

        [AllowAnonymous]//TODO:公開時の削除
        public ActionResult TestConfirmation()
        {
#if DEBUG
            return View("ExternalLoginConfirmation");
#else
            return null;
#endif
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

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel vm)
        {
            if (vm == null) return View("Page403");
            if (User.Identity.IsAuthenticated||!vm.AcceptTerm) return RedirectToAction("LogIn");
            if (ModelState.IsValid)
            {
                ExternalLoginInfo info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = UserAccount.CreateUser(info.Login.LoginProvider + info.Login.ProviderKey, vm.NickName,
                    vm.Email,vm.AcceptMail);
                IdentityResult result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInAsync(user, false);

                        // アカウント確認とパスワード リセットを有効にする方法の詳細については、http://go.microsoft.com/fwlink/?LinkID=320771 を参照してください
                        // このリンクを含む電子メールを送信します
                        // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                        // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                        // SendEmail(user.Email, callbackUrl, "アカウントの確認", "このリンクをクリックすることによってアカウントを確認してください");

                        return RedirectToLocal(vm.ReturnUrl);
                    }
                }
            }
            return View(vm);
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

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }
    }

    public class ExternalLoginConfirmationViewModel
    {
        public string ReturnUrl { get; set; }
        [Display(Name = "ニックネーム")]
        public string NickName { get; set; }
        [Display(Name = "メールアドレス")]
        public string Email { get; set; }
        [Display(Name = "利用規約に同意する")]
        public bool AcceptTerm { get; set; }
        [Display(Name = "linophiの通知をメールで受け取る")]
        public bool AcceptMail { get; set; }
    }


}