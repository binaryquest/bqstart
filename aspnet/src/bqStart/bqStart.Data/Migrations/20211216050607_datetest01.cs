using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bqStart.Data.Migrations
{
    public partial class datetest01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ClassDate",
                table: "ExampleClasses",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassDate",
                table: "ExampleClasses");
        }
    }
}
