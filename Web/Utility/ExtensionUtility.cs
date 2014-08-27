using System;
using System.Net;
using System.Text;

namespace Web.Utility
{
    public static class ExtensionUtility
    {
        #region 文字列妥当性チェック
        public static bool IsNullOrEmpty(this string str)
        {
            return String.IsNullOrEmpty(str);
        }

        public static bool IsNullOrWhiteSpace(this string str)
        {
            return String.IsNullOrWhiteSpace(str);
        }

        #endregion

        public static string ToHexString(this byte[] arr)
        {
            StringBuilder builder=new StringBuilder();
            foreach (var b in arr)
            {
                builder.Append(b.ToString("x2"));
            }
            return builder.ToString();
        }

        public static int ToInt32(this string str)
        {
            return Int32.Parse(str);
        }

        public static bool TryToInt32(this string str, out int val)
        {
            bool isSuccess = Int32.TryParse(str, out val);
            return isSuccess;
        }

        public static HttpStatusCode GetStatusCode(this HttpWebRequest req)
        {
            HttpWebResponse res = null;
            HttpStatusCode statusCode;

            try
            {
                res = (HttpWebResponse)req.GetResponse();
                statusCode = res.StatusCode;

            }
            catch (WebException ex)
            {

                res = (HttpWebResponse)ex.Response;

                if (res != null)
                {
                    statusCode = res.StatusCode;
                }
                else
                {
                    throw; // サーバ接続不可などの場合は再スロー
                }
            }
            finally
            {
                if (res != null)
                {
                    res.Close();
                }
            }
            return statusCode;
        }
    }
}