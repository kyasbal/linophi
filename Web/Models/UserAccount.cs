using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace linophi.Models
{
    // ApplicationUser クラスにプロパティを追加することでユーザーのプロファイル データを追加できます。詳細については、http://go.microsoft.com/fwlink/?LinkID=317594 を参照してください。
    public class UserAccount : IdentityUser
    {
        /// <summary>
        /// 初期の状態のアカウントのインスタンスを作成します。
        /// </summary>
        /// <param name="birthDay"></param>
        /// <param name="nickname"></param>
        /// <param name="email"></param>
        /// <param name="gender"></param>
        /// <returns></returns>
        public static UserAccount CreateUser(DateTime? birthDay,string userName,string nickname,string email,GenderType gender)
        {
            return new UserAccount()
            {
                UserName = userName,
                Email = email,
                BirthDay = birthDay,
                NickName = nickname,
                Gender = gender,
                UpdateTime = DateTime.Now,
                CreationTime = DateTime.Now
            };
        }

        /// <summary>
        /// 生年月日
        /// </summary>
        public DateTime? BirthDay { get; set; }

        /// <summary>
        /// URLで一意に識別するための値
        /// </summary>
        public string UrlId { get; set; }

        /// <summary>
        /// ニックネーム
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// 説明
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 性別
        /// </summary>
        public UserAccount.GenderType Gender { get; set; }
        
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

        public enum GenderType
        {
            Male,Female
        }
    }
}