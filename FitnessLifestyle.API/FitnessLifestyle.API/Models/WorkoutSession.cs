using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessLifestyle.API.Models
{
    public class WorkoutSession
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }

        public int DurationMinutes { get; set; }
        public int UserId { get; set; }
        public int ExerciseId { get; set; }

        public int Reps { get; set; }
        public int Sets { get; set; }
        public double DurationInSeconds { get; set; }
        public double CaloriesBurned { get; set; }

        [Range(0, 100)]
        public double AccuracyScore { get; set; } 

        public DateTime PerformedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        [ForeignKey("ExerciseId")]
        public virtual Exercise? Exercise { get; set; }
    }
}