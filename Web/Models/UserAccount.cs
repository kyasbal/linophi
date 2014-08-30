using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Web.Models
{
    // ApplicationUser クラスにプロパティを追加することでユーザーのプロファイル データを追加できます。詳細については、http://go.microsoft.com/fwlink/?LinkID=317594 を参照してください。
    public class UserAccount : IdentityUser
    {
        /// <summary>
        /// 初期の状態のアカウントのインスタンスを作成します。
        /// </summary>
        /// <param name="nickname"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public static UserAccount CreateUser(string userName,string nickname,string email,bool acceptEmail)
        {
            return new UserAccount()
            {
                UserName = userName,
                Email = email,
                NickName = nickname,
                UpdateTime = DateTime.Now,
                CreationTime = DateTime.Now,
                AcceptEmail = acceptEmail
            };
        }

        /// <summary>
        /// ニックネーム
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// 説明
        /// </summary>
        public string Description { get; set; }

        public bool AcceptEmail { get; set; }

        /// <summary>
        /// アカウント作成日時
        /// </summary>
        public DateTime? CreationTime { get; set; }

        /// <summary>
        /// 更新日時
        /// </summary>
        public DateTime? UpdateTime { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<UserAccount> manager)
        {
            // authenticationType が CookieAuthenticationOptions.AuthenticationType で定義されているものと一致している必要があります
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // ここにカスタム ユーザー クレームを追加します
            return userIdentity;
        }
    }
}