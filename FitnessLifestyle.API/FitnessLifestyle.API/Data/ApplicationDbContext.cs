using FitnessLifestyle.API.Models;
using Microsoft.EntityFrameworkCore;


namespace FitnessLifestyle.API.Data 
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MedicalProfile> MedicalProfiles { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<NutritionLog> NutritionLogs { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<UserBadge> UserBadges { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //  Cấu hình quan hệ 1-1 cho User và MedicalProfile
            modelBuilder.Entity<User>()
                .HasOne(u => u.MedicalProfile)
                .WithOne(p => p.User)
                .HasForeignKey<MedicalProfile>(p => p.UserId);

            //  SEED DATA CHO BÀI TẬP (EXERCISES)
            modelBuilder.Entity<Exercise>().HasData(
                new Exercise
                {
                    Id = 1,
                    Name = "Squat",
                    Category = "Legs",
                    Description = "Bài tập đứng lên ngồi xuống cho cơ đùi và mông.",
                    MetValue = 5.0,
                    VideoUrl = "squat_tutorial.mp4"
                },
                new Exercise
                {
                    Id = 2,
                    Name = "Push-up",
                    Category = "Chest",
                    Description = "Bài tập hít đất cho cơ ngực và tay sau.",
                    MetValue = 8.0,
                    VideoUrl = "pushup_tutorial.mp4"
                },
                new Exercise
                {
                    Id = 3,
                    Name = "Plank",
                    Category = "Abs",
                    Description = "Bài tập giữ người thẳng cho cơ lõi (core).",
                    MetValue = 3.0,
                    VideoUrl = "plank_tutorial.mp4"
                }
            );

            modelBuilder.Entity<Food>().HasData(
                new Food { Id = 1, Name = "Ức gà (100g)", Calories = 165, Protein = 31, Carbs = 0, Fat = 3.6 },
                new Food { Id = 2, Name = "Gạo lứt (100g)", Calories = 110, Protein = 2.6, Carbs = 23, Fat = 0.9 },
                new Food { Id = 3, Name = "Trứng gà (1 quả)", Calories = 78, Protein = 6, Carbs = 0.6, Fat = 5 }
            );
        }
    }
}