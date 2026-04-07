using System.ComponentModel.DataAnnotations;

namespace FitnessLifestyle.API.Models
{
    public class Food
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public double Calories { get; set; } 
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }

        public string? ImageUrl { get; set; }
    }
}