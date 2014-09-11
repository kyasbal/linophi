namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddThemeToTag : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ArticleTagModels", "IsThemeTag", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ArticleTagModels", "IsThemeTag");
        }
    }
}
