using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessLifestyle.API.Models
{
    public enum Gender { Male, Female, Other }
    public enum ActivityLevel { Sedentary, LightlyActive, ModeratelyActive, VeryActive, ExtraActive }
    public enum FitnessGoal { WeightLoss, Maintenance, MuscleGain }

    public class MedicalProfile
    {
        [Key, ForeignKey("User")]
        public int UserId { get; set; }

        [Range(50, 250)]
        public double Height { get; set; } 

        [Range(30, 300)]
        public double Weight { get; set; } 

        [Range(10, 100)]
        public int Age { get; set; }

        public Gender Gender { get; set; }
        public ActivityLevel ActivityLevel { get; set; }
        public FitnessGoal Goal { get; set; }


        public double BMI => Weight / Math.Pow(Height / 100, 2);
        public double BMR { get; set; }
        public double TDEE { get; set; }

        public virtual User? User { get; set; }
    }
}