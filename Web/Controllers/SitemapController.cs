using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using Web.Models;
using Web.Utility.SEO;

namespace Web.Controllers
{
    public class SitemapController : Controller
    {
        // GET: Sitemap
        public ActionResult Index()
        {
            var sitemaps = new List<SitemapItem>
            {
                new SitemapItem("/", changeFrequency: SitemapChangeFrequency.Hourly, priority: 1.0),
                new SitemapItem("/About", changeFrequency:SitemapChangeFrequency.Weekly),
                new SitemapItem("/Inquiry",changeFrequency:SitemapChangeFrequency.Weekly),
                new SitemapItem("/PrivacyPolicy",changeFrequency:SitemapChangeFrequency.Daily),
                new SitemapItem("/Terms",changeFrequency:SitemapChangeFrequency.Daily)
            };
            var dbContext = Request.GetOwinContext().Get<ApplicationDbContext>();
            foreach (var articleModel in dbContext.Articles)
            {
                sitemaps.Add(new SitemapItem("/"+articleModel.ArticleModelId,changeFrequency:SitemapChangeFrequency.Daily,lastModified:articleModel.UpdateTime));
            }
            foreach (var topicModel in dbContext.Topics)
            {
                sitemaps.Add(new SitemapItem("/Topic/" + topicModel.TopicId, changeFrequency: SitemapChangeFrequency.Daily, lastModified: topicModel.UpdateTime));
            }
            return new SitemapResult(sitemaps);
        }
    }
}