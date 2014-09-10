namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTheme : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ArticleModels", "ThemeId", c => c.String());
            AddColumn("dbo.ArticleModels", "RelatedArticleId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ArticleModels", "RelatedArticleId");
            DropColumn("dbo.ArticleModels", "ThemeId");
        }
    }
}
