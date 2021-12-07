using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bqStart.Data.Migrations
{
    public partial class BoolTest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ExampleClasses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ExampleClasses");
        }
    }
}
