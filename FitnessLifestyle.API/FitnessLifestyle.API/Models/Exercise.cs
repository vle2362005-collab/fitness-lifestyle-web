using System.ComponentModel.DataAnnotations;

namespace FitnessLifestyle.API.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Category { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }

        public double MetValue { get; set; }

        public string? AiConfig { get; set; }


        public string? PoseAngles { get; set; }
        public int CaloriesPerMinute { get; internal set; }
    }
}