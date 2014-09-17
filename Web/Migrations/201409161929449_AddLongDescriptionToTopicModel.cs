namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLongDescriptionToTopicModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TopicModels", "LongDescription", c => c.String(defaultValue:""));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TopicModels", "LongDescription");
        }
    }
}
