namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUnknown : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.CurrentRankingModels", "TopicId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.CurrentRankingModels", "TopicId", c => c.String());
        }
    }
}
