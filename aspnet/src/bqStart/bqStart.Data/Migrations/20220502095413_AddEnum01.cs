using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bqStart.Data.Migrations
{
    public partial class AddEnum01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassType",
                table: "ExampleClasses",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassType",
                table: "ExampleClasses");
        }
    }
}
