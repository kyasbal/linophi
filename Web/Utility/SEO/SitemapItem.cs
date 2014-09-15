using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;

namespace Web.Utility.SEO
{

    /// <summary>
    /// Generates an XML sitemap from a collection of <see cref="ISitemapItem"/>
    /// </summary>
    public class SitemapResult : ActionResult
    {
        private readonly IEnumerable<ISitemapItem> items;
        private readonly ISitemapGenerator generator;

        public SitemapResult(IEnumerable<ISitemapItem> items)
            : this(items, new SitemapItem.SitemapGenerator())
        {
        }

        public SitemapResult(IEnumerable<ISitemapItem> items, ISitemapGenerator generator)
        {
            this.items = items;
            this.generator = generator;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var response = context.HttpContext.Response;

            response.ContentType = "text/xml";
            response.ContentEncoding = Encoding.UTF8;

            using (var writer = new XmlTextWriter(response.Output))
            {
                writer.Formatting = Formatting.Indented;
                var sitemap = generator.GenerateSiteMap(items);

                sitemap.WriteTo(writer);
            }
        }
    }

    public static class UrlHelperExtensions
    {
        /// <summary>
        /// Returns a full qualified action URL
        /// </summary>
        public static string QualifiedAction(this UrlHelper url, string actionName, string controllerName, object routeValues = null)
        {
            return url.Action(actionName, controllerName, routeValues, url.RequestContext.HttpContext.Request.Url.Scheme);
        }
    }
    /// <summary>
    /// Represents a sitemap item.
    /// </summary>
    public class SitemapItem : ISitemapItem
    {

        /// <summary>
        /// A class for creating XML Sitemaps (see http://www.sitemaps.org/protocol.html)
        /// </summary>
        public class SitemapGenerator : ISitemapGenerator
        {
            private static readonly XNamespace xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            private static readonly XNamespace xsi = "http://www.w3.org/2001/XMLSchema-instance";

            public virtual XDocument GenerateSiteMap(IEnumerable<ISitemapItem> items)
            {
                var sitemap = new XDocument(
                    new XDeclaration("1.0", "utf-8", "yes"),
                        new XElement(xmlns + "urlset",
                          new XAttribute("xmlns", xmlns),
                          new XAttribute(XNamespace.Xmlns + "xsi", xsi),
                          new XAttribute(xsi + "schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"),
                          from item in items
                          select CreateItemElement(item)
                          )
                     );

                return sitemap;
            }

            private XElement CreateItemElement(ISitemapItem item)
            {
                var itemElement = new XElement(xmlns + "url", new XElement(xmlns + "loc", item.Url.ToLowerInvariant()));

                // all other elements are optional

                if (item.LastModified.HasValue)
                    itemElement.Add(new XElement(xmlns + "lastmod", item.LastModified.Value.ToString("yyyy-MM-dd")));

                if (item.ChangeFrequency.HasValue)
                    itemElement.Add(new XElement(xmlns + "changefreq", item.ChangeFrequency.Value.ToString().ToLower()));

                if (item.Priority.HasValue)
                    itemElement.Add(new XElement(xmlns + "priority", item.Priority.Value.ToString("F1", CultureInfo.InvariantCulture)));

                return itemElement;
            }
        }
        /// <summary>
        /// Creates a new instance of <see cref="SitemapItem"/>
        /// </summary>
        /// <param name="url">URL of the page. Optional.</param>
        /// <param name="lastModified">The date of last modification of the file. Optional.</param>
        /// <param name="changeFrequency">How frequently the page is likely to change. Optional.</param>
        /// <param name="priority">The priority of this URL relative to other URLs on your site. Valid values range from 0.0 to 1.0. Optional.</param>
        /// <exception cref="System.ArgumentNullException">If the <paramref name="url"/> is null or empty.</exception>
        public SitemapItem(string url, DateTime? lastModified = null, SitemapChangeFrequency? changeFrequency = null, double? priority = null)
        {
            Url = "http://意見.みんな"+url;
            LastModified = lastModified;
            ChangeFrequency = changeFrequency;
            Priority = priority;
        }

        /// <summary>
        /// URL of the page.
        /// </summary>
        public string Url { get; protected set; }

        /// <summary>
        /// The date of last modification of the file.
        /// </summary>
        public DateTime? LastModified { get; protected set; }

        /// <summary>
        /// How frequently the page is likely to change.
        /// </summary>
        public SitemapChangeFrequency? ChangeFrequency { get; protected set; }

        /// <summary>
        /// The priority of this URL relative to other URLs on your site. Valid values range from 0.0 to 1.0.
        /// </summary>
        public double? Priority { get; protected set; }
    }

    /// <summary>
    /// How frequently the page is likely to change. This value provides general information to search engines and may not correlate exactly to how often they crawl the page.
    /// </summary>
    /// <remarks>
    /// The value "always" should be used to describe documents that change each time they are accessed. The value "never" should be used to describe archived URLs.
    /// </remarks>
    public enum SitemapChangeFrequency
    {
        Always,
        Hourly,
        Daily,
        Weekly,
        Monthly,
        Yearly,
        Never
    }
    public interface ISitemapGenerator
    {
        XDocument GenerateSiteMap(IEnumerable<ISitemapItem> items);
    }

    /// <summary>
    /// An interface for sitemap items
    /// </summary>
    public interface ISitemapItem
    {
        /// <summary>
        /// URL of the page.
        /// </summary>
        string Url { get; }

        /// <summary>
        /// The date of last modification of the file.
        /// </summary>
        DateTime? LastModified { get; }

        /// <summary>
        /// How frequently the page is likely to change.
        /// </summary>
        SitemapChangeFrequency? ChangeFrequency { get; }

        /// <summary>
        /// The priority of this URL relative to other URLs on your site. Valid values range from 0.0 to 1.0.
        /// </summary>
        double? Priority { get; }
    }
}