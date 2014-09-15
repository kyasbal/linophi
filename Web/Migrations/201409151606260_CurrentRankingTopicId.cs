namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CurrentRankingTopicId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CurrentRankingModels", "TopicId", c => c.String());
        }
        
        public override void Down()
        {
            DropIndex("dbo.CurrentRankingModels", new[] { "TopicId" });
        }
    }
}
