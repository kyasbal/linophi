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
    }
}