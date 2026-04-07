using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessLifestyle.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingFieldsToModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "WorkoutSessions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "WorkoutSessions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "NutritionLogs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "NutritionLogs");
        }
    }
}
