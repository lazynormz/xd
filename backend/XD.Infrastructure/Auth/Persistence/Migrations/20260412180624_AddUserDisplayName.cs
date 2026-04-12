using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XD.Infrastructure.Auth.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserDisplayName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "Users",
                type: "TEXT",
                maxLength: 64,
                nullable: false,
                defaultValue: "username");

            migrationBuilder.Sql(
                """
                WITH ordered_users AS (
                    SELECT
                        "Id",
                        ROW_NUMBER() OVER (ORDER BY "CreatedAtUtc", "Id") AS "RowNumber"
                    FROM "Users"
                )
                UPDATE "Users"
                SET "DisplayName" = CASE
                    WHEN (
                        SELECT "RowNumber"
                        FROM ordered_users
                        WHERE ordered_users."Id" = "Users"."Id"
                    ) = 1 THEN 'username'
                    ELSE 'username-' || (
                        SELECT "RowNumber"
                        FROM ordered_users
                        WHERE ordered_users."Id" = "Users"."Id"
                    )
                END;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Users_DisplayName",
                table: "Users",
                column: "DisplayName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_DisplayName",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "Users");
        }
    }
}
