﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Web.Api.Article;
using Web.Models;
using Web.Storage;
using Web.Storage.Connection;
using Web.Utility;

namespace Web.Controllers
{
    [Authorize]
    public class EditController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult RedirectToEdit()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index");
            }
            else
            {
                return Redirect("/Account/Login?returnUrl=/RedirectToEdit");
            }
        }

        [HttpGet]
        [Authorize]
        // GET: Edit
        public async Task<ActionResult> Index(string topicId="",string articleId="",string EditMode="new",string RelatedArticle="")
        {
            //記事IDがある場合
            ArticleEditViewModel vm=new ArticleEditViewModel();
            ArticleModel articleModel = null;
            if(!String.IsNullOrWhiteSpace(articleId))
            {
            //対象の記事の取得
                var context = Request.GetOwinContext().Get<ApplicationDbContext>();
                 articleModel= await context.Articles.FindAsync(articleId);
                if (!articleModel.AuthorID.Equals(User.Identity.Name))
                {
                    return View("Page403");
                }
                await context.Entry(articleModel).Collection(a=>a.Tags).LoadAsync();
            }
            if (EditMode.Equals("edit"))
            {
                ArticleMarkupTableManager amtm = new ArticleMarkupTableManager(new BlobStorageConnection());
                string markup = await amtm.GetArticleBodyAsync(articleId);
                vm.MarkupString = markup;
            }
            else if (EditMode.Equals("append"))
            {
                vm.MarkupString = string.Format("---\n\n##{0}追記分\n\n", DateTime.Now);
            }
            //newのときはしなくていい処理・・・タグ/タイトル/記事IDの保存
            if (!EditMode.Equals("new"))
            {
                vm.Title = articleModel.Title;
                string tagsStr = "";
                foreach (var tag in articleModel.Tags)
                {
                    tagsStr += tag.TagName + " ";
                }
                vm.Tags = tagsStr;
                vm.ArticleId = articleId;
            }
            vm.EditMode = EditMode;
            vm.RelatedArticle = RelatedArticle;
            vm.TopicId = topicId;
            return View(vm);
        }

        /// <summary>
        /// アップロード時のアクションメソッド
        /// </summary>
        /// <param name="vm"></param>
        /// <returns></returns>
        [Authorize]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<ActionResult> Index(EditViewModel vm)
        {
            ApplicationDbContext context = HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            var connection = new BlobStorageConnection();
            ArticleBodyTableManager abtm = new ArticleBodyTableManager(connection);
            ArticleMarkupTableManager amtm = new ArticleMarkupTableManager(connection);
            ArticleThumbnailManager atm=new ArticleThumbnailManager(connection);
            if (vm.Mode.Equals("new"))
            {
                if (!ArticleController.IsValidTitle(vm.Title, context).IsOK) return RedirectToAction("Page404", "Home");
                var article = ArticleModel.GenerateArticle(vm.Title, User.Identity.Name);
                if (String.IsNullOrWhiteSpace(vm.RelatedArticle))
                {//関連記事がない場合、新しいテーマとして判断する
                    if (String.IsNullOrWhiteSpace(vm.TopicId))
                    {
                        article.ThemeId = IdGenerator.getId(10);
                    }
                    else
                    {
                        article.ThemeId = vm.TopicId;
                    }
                    article.RelatedArticleId = null;
                }
                else
                {
                    var relatedArticle =await context.Articles.FindAsync(vm.RelatedArticle);
                    article.ThemeId = relatedArticle.ThemeId;
                    article.RelatedArticleId = vm.RelatedArticle;
                }
                //タグの処理
                var tags = System.Web.Helpers.Json.Decode<string[]>(vm.Tag);
                if (tags.Length > 5||vm.Markup.Length<=400||tags.Any(t=>t.Length>=15)) return RedirectToAction("Page404", "Home");
                foreach (var tag in tags)
                {
                    ArticleTagModel tagModel = context.Tags.Where(f => f.TagName.Equals(tag)).SingleOrDefault();
                    bool needToAdd = tagModel == null;
                    tagModel = tagModel ?? ArticleTagModel.GenerateTag(tag);
                    if (needToAdd)
                    {
                        context.Tags.Add(tagModel);
                    }
                    else
                    {
                        await context.Entry(tagModel).Collection(c => c.Articles).LoadAsync();
                    }
                    tagModel.Articles.Add(article);
                    article.Tags.Add(tagModel);
                }
                //記事の追加
                context.Articles.Add(article);
                await context.SaveChangesAsync();
                await abtm.AddArticle(article.ArticleModelId, vm.Body);
                await amtm.AddMarkupAsync(article.ArticleModelId, vm.Markup);
                await atm.UploadThumbnail(article.ArticleModelId, vm.Thumbnail);
                return Redirect("~/" + article.ArticleModelId);
            }else if (vm.Mode.Equals("edit"))
            {
                if (!User.IsInRole("Administrator")) return RedirectToAction("Page404", "Home");
                LabelTableManager lm=new LabelTableManager(new TableStorageConnection());
                ArticleModel articleModel = await context.Articles.FindAsync(vm.Id);
                if (!articleModel.AuthorID.Equals(User.Identity.Name)) return View("Page403");
                await context.Entry(articleModel).Collection(a => a.Tags).LoadAsync();
                articleModel.Tags.Clear();
                var tags = System.Web.Helpers.Json.Decode<string[]>(vm.Tag);
                if (tags.Length > 5) return RedirectToAction("Page404", "Home");
                foreach (var tag in tags)
                {
                    ArticleTagModel tagModel = context.Tags.Where(f => f.TagName.Equals(tag)).SingleOrDefault();
                    bool needToAdd = tagModel == null;
                    tagModel = tagModel ?? ArticleTagModel.GenerateTag(tag);
                    if (needToAdd)
                    {
                        context.Tags.Add(tagModel);
                    }
                    else
                    {
                        await context.Entry(tagModel).Collection(c => c.Articles).LoadAsync();
                    }
                    tagModel.Articles.Add(articleModel);
                    articleModel.Tags.Add(tagModel);
                }
                articleModel.LabelCount = 0;
                await context.SaveChangesAsync();
                await abtm.AddArticle(articleModel.ArticleModelId, vm.Body);
                await amtm.AddMarkupAsync(articleModel.ArticleModelId, vm.Markup);
                await atm.UploadThumbnail(articleModel.ArticleModelId, vm.Thumbnail);
                await lm.RemoveArticleLabelAsync(vm.Id);
                return Redirect("~/" + vm.Id);
            }else if (vm.Mode.Equals("append"))
            {
                LabelTableManager lm = new LabelTableManager(new TableStorageConnection());
                ArticleModel articleModel = await context.Articles.FindAsync(vm.Id);
                if (!articleModel.AuthorID.Equals(User.Identity.Name)) return View("Page403");
                await context.Entry(articleModel).Collection(a => a.Tags).LoadAsync();
                articleModel.Tags.Clear();
                var tags = System.Web.Helpers.Json.Decode<string[]>(vm.Tag);
                if (tags.Length > 5) return RedirectToAction("Page404", "Home");
                foreach (var tag in tags)
                {
                    ArticleTagModel tagModel = context.Tags.Where(f => f.TagName.Equals(tag)).SingleOrDefault();
                    bool needToAdd = tagModel == null;
                    tagModel = tagModel ?? ArticleTagModel.GenerateTag(tag);
                    if (needToAdd)
                    {
                        context.Tags.Add(tagModel);
                    }
                    else
                    {
                        await context.Entry(tagModel).Collection(c => c.Articles).LoadAsync();
                    }
                    tagModel.Articles.Add(articleModel);
                    articleModel.Tags.Add(tagModel);
                }
                articleModel.LabelCount = 0;
                await context.SaveChangesAsync();
                await abtm.AppendArticle(articleModel.ArticleModelId, vm.Body);
                await amtm.AppendMarkupAsync(articleModel.ArticleModelId, vm.Markup);
                await atm.UploadThumbnail(articleModel.ArticleModelId, vm.Thumbnail);
                return Redirect("~/" + vm.Id);
            }
            else
            {
                return View("Page403");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> Preview(EditViewModel vm)
        {
            var context = Request.GetOwinContext().Get<ApplicationDbContext>();
            var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            UserAccount userAccount = await userManager.FindByNameAsync(User.Identity.Name);
            IGravatarLoader gLoader = BasicGravatarLoader.GetBasicGravatarLoader(userAccount);
            int count = 0;
            return View("~/Views/Home/Index.cshtml",new ViewArticleViewModel()
            {
                ArticleId = "Preview",
                Author = userAccount.NickName,
                Author_ID = userAccount.UniqueId,
                Author_IconTag = gLoader.GetIconTag(50),
                PageView = 0,
                Title =vm.Title,
                Content = vm.Body,
                LabelInfo = "[]",
                Tags = null,
                LabelCount = 0,
                Article_Date = DateTime.Now.ToShortDateString(),
                Article_UpDate = DateTime.Now.ToShortDateString(),
                UseThumbnail = false,
                CommentInfo ="[]",
                CommentCount =0,
                AuthorsArticles = HomeController.getUserArticles(context,0, 0, User.Identity.Name,out count, takeCount: 3),
                IsPreview = true,
                RelatedArticles =new List<SearchResultArticle>()
            });
        }
    }
}