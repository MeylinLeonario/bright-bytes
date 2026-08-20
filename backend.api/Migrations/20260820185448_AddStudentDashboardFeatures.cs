using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.api.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentDashboardFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WeeklyGoalDays",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StudyActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VisitedLesson = table.Column<bool>(type: "boolean", nullable: false),
                    PracticedWriting = table.Column<bool>(type: "boolean", nullable: false),
                    PracticedSpeaking = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyActivities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudyActivities_UserId_LessonId_ActivityDate",
                table: "StudyActivities",
                columns: new[] { "UserId", "LessonId", "ActivityDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudyActivities");

            migrationBuilder.DropColumn(
                name: "WeeklyGoalDays",
                table: "Users");
        }
    }
}
