namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRawTextDescription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TopicModels", "RawTextDescription", c => c.String(defaultValue:""));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TopicModels", "RawTextDescription");
        }
    }
}
