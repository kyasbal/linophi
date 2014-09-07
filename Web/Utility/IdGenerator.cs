using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace Web.Utility
{
    public class IdGenerator
    {
        private const string idString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public static string getId(byte digits)
        {
            byte[] bytes=new byte[digits];
            RNGCryptoServiceProvider rng=new RNGCryptoServiceProvider();
            rng.GetBytes(bytes);
            string ret = "";
            foreach (var b in bytes)
            {
                ret += idString[b%idString.Length];
            }
            return ret;
        }

        public static string getCommentId(string author, DateTime day)
        {
            return calcHash(author + day.ToLongDateString()).Substring(0,15);
        }

        private static string calcHash(string source)
        {
            //文字列をbyte型配列に変換する
            byte[] data = System.Text.Encoding.UTF8.GetBytes(source);

            //MD5CryptoServiceProviderオブジェクトを作成
            System.Security.Cryptography.MD5CryptoServiceProvider md5 =
                new System.Security.Cryptography.MD5CryptoServiceProvider();
            //または、次のようにもできる
            //System.Security.Cryptography.MD5 md5 =
            //    System.Security.Cryptography.MD5.Create();

            //ハッシュ値を計算する
            byte[] bs = md5.ComputeHash(data);

            //リソースを解放する
            md5.Clear();

            //byte型配列を16進数の文字列に変換
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            foreach (byte b in bs)
            {
                result.Append(b.ToString("x2"));
            }
            return result.ToString();
        }
    }
}