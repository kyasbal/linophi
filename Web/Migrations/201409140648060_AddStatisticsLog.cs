namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStatisticsLog : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.StatisticsLogModels",
                c => new
                    {
                        Key = c.String(nullable: false, maxLength: 128),
                        JobTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Key);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.StatisticsLogModels");
        }
    }
}
