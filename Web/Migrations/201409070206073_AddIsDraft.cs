namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsDraft : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ArticleModels", "IsDraft", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ArticleModels", "IsDraft");
        }
    }
}
