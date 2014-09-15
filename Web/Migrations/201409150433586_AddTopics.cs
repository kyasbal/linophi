namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTopics : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TopicModels",
                c => new
                    {
                        TopicId = c.String(nullable: false, maxLength: 128),
                        TopicTitle = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.TopicId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.TopicModels");
        }
    }
}
