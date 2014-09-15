namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddColumnToTopics : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TopicModels", "EvaluationOfFire", c => c.Double(nullable: false));
            AddColumn("dbo.TopicModels", "IsVisibleToAllUser", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TopicModels", "IsVisibleToAllUser");
            DropColumn("dbo.TopicModels", "EvaluationOfFire");
        }
    }
}
