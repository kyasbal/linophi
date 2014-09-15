namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUnknown2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CurrentRankingModels", "TopicId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.CurrentRankingModels", "TopicId");
        }
    }
}
