using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bqStart.Data.Migrations
{
    public partial class address02 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                table: "Departments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_AddressId",
                table: "Departments",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Addresses_AddressId",
                table: "Departments",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Addresses_AddressId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_AddressId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Departments");
        }
    }
}
