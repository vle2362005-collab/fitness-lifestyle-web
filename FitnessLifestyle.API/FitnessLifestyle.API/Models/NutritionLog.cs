using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessLifestyle.API.Models
{
    public enum MealType { Breakfast, Lunch, Dinner, Snack }

    public class NutritionLog
    {
        [Key]
        public int Id { get; set; }

        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int FoodId { get; set; }

        [Range(0, 5000)]
        public double Quantity { get; set; } 

        public MealType MealType { get; set; }
        public DateTime LogDate { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        [ForeignKey("FoodId")]
        public virtual Food? Food { get; set; }
    }
}