namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCurrentRanking : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CurrentRankingModels",
                c => new
                    {
                        ArticleId = c.String(nullable: false, maxLength: 128),
                        PVCoefficient = c.Double(nullable: false),
                        CommentCoefficient = c.Double(nullable: false),
                        LabelCoefficient = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.ArticleId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.CurrentRankingModels");
        }
    }
}
