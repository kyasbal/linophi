using System;
using System.Reflection;

namespace Web.Utility.OGP
{
    [AttributeUsage(AttributeTargets.Assembly)]
    public abstract class OGPSiteMetaAttribute:Attribute
    {
        protected OGPSiteMetaAttribute(string value)
        {
            Value = value;
        }

        public string Value { get; private set; }
    }

    [AttributeUsage(AttributeTargets.Assembly)]
    class OGPSiteNameAttribute : OGPSiteMetaAttribute
    {
        public OGPSiteNameAttribute(string siteName) : base(siteName)
        {
        }
    }

    [AttributeUsage(AttributeTargets.Assembly)]
    class OGPDefaultLocaleAttribute : OGPSiteMetaAttribute
    {
        public OGPDefaultLocaleAttribute(string locale)
            : base(locale)
        {
        }
    }

    [AttributeUsage(AttributeTargets.Assembly)]
    class OGPDefaultImageAttribute : OGPSiteMetaAttribute
    {
        public OGPDefaultImageAttribute(string imageUrl)
            : base(imageUrl)
        {
        }
    }

    [AttributeUsage(AttributeTargets.Assembly)]
    class TwitterCardSiteAttribute : OGPSiteMetaAttribute
    {
        public TwitterCardSiteAttribute(string user)
            : base(user)
        {
        }
    }

    public static class OGPAttributeHelper
    {
        public static string GetOGPMeta<T>(this Assembly asm)where T:OGPSiteMetaAttribute
        {
            T t = asm.GetCustomAttribute<T>();
            if (t == null) return null;
            return t.Value;
        }
    }
}