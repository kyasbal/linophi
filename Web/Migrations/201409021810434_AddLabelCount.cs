namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLabelCount : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ArticleModels", "LabelCount", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ArticleModels", "LabelCount");
        }
    }
}
