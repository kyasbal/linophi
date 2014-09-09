namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdjustDatabase : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.ArticleModels", "TitleIndex");
            DropIndex("dbo.ArticleModels", "AuthorIndex");
        }
        
        public override void Down()
        {
            CreateIndex("dbo.ArticleModels", new[] { "AuthorID", "IsDraft" }, name: "AuthorIndex");
            CreateIndex("dbo.ArticleModels", new[] { "Title", "IsDraft" }, name: "TitleIndex");
        }
    }
}
