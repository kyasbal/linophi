namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CurrentRankingTopicId2 : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.CurrentRankingModels", new[] { "TopicId" });
        }
        
        public override void Down()
        {
            CreateIndex("dbo.CurrentRankingModels", "TopicId");
        }
    }
}
