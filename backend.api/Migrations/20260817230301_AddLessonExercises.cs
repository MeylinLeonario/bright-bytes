using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.api.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpeakingPrompt",
                table: "Lessons",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WritingPrompt",
                table: "Lessons",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpeakingPrompt",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "WritingPrompt",
                table: "Lessons");
        }
    }
}
