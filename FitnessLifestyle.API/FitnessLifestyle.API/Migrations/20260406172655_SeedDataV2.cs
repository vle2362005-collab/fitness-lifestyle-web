using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitnessLifestyle.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "Category", "Description", "MetValue", "Name", "VideoUrl" },
                values: new object[,]
                {
                    { 1, "Legs", "Bài tập đứng lên ngồi xuống cho cơ đùi và mông.", 5.0, "Squat", "squat_tutorial.mp4" },
                    { 2, "Chest", "Bài tập hít đất cho cơ ngực và tay sau.", 8.0, "Push-up", "pushup_tutorial.mp4" },
                    { 3, "Abs", "Bài tập giữ người thẳng cho cơ lõi (core).", 3.0, "Plank", "plank_tutorial.mp4" }
                });

            migrationBuilder.InsertData(
                table: "Foods",
                columns: new[] { "Id", "Calories", "Carbs", "Fat", "ImageUrl", "Name", "Protein" },
                values: new object[,]
                {
                    { 1, 165.0, 0.0, 3.6000000000000001, null, "Ức gà (100g)", 31.0 },
                    { 2, 110.0, 23.0, 0.90000000000000002, null, "Gạo lứt (100g)", 2.6000000000000001 },
                    { 3, 78.0, 0.59999999999999998, 5.0, null, "Trứng gà (1 quả)", 6.0 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Foods",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Foods",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Foods",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
