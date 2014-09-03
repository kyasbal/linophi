namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStupidUpdate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ArticleModels",
                c => new
                    {
                        ArticleModelId = c.String(nullable: false, maxLength: 128),
                        Title = c.String(),
                        AuthorID = c.String(),
                        PageView = c.Int(nullable: false),
                        LabelCount = c.Int(nullable: false),
                        CreationTime = c.DateTime(nullable: false),
                        UpdateTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ArticleModelId);
            
            CreateTable(
                "dbo.ArticleTagModels",
                c => new
                    {
                        ArticleTagModelId = c.String(nullable: false, maxLength: 128),
                        TagName = c.String(),
                    })
                .PrimaryKey(t => t.ArticleTagModelId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UniqueId = c.String(),
                        NickName = c.String(),
                        Description = c.String(),
                        AcceptEmail = c.Boolean(nullable: false),
                        CreationTime = c.DateTime(),
                        UpdateTime = c.DateTime(),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.ArticleTagModelArticleModels",
                c => new
                    {
                        ArticleTagModel_ArticleTagModelId = c.String(nullable: false, maxLength: 128),
                        ArticleModel_ArticleModelId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.ArticleTagModel_ArticleTagModelId, t.ArticleModel_ArticleModelId })
                .ForeignKey("dbo.ArticleTagModels", t => t.ArticleTagModel_ArticleTagModelId, cascadeDelete: true)
                .ForeignKey("dbo.ArticleModels", t => t.ArticleModel_ArticleModelId, cascadeDelete: true)
                .Index(t => t.ArticleTagModel_ArticleTagModelId)
                .Index(t => t.ArticleModel_ArticleModelId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.ArticleTagModelArticleModels", "ArticleModel_ArticleModelId", "dbo.ArticleModels");
            DropForeignKey("dbo.ArticleTagModelArticleModels", "ArticleTagModel_ArticleTagModelId", "dbo.ArticleTagModels");
            DropIndex("dbo.ArticleTagModelArticleModels", new[] { "ArticleModel_ArticleModelId" });
            DropIndex("dbo.ArticleTagModelArticleModels", new[] { "ArticleTagModel_ArticleTagModelId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropTable("dbo.ArticleTagModelArticleModels");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.ArticleTagModels");
            DropTable("dbo.ArticleModels");
        }
    }
}
