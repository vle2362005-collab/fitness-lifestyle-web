using FitnessLifestyle.API.Models;

namespace FitnessLifestyle.API.Services
{
    public class FitnessService : IFitnessService
    {
        public void CalculateFitnessMetrics(MedicalProfile profile)
        {
            if (profile.Gender == Gender.Male)
            {
                profile.BMR = (10 * profile.Weight) + (6.25 * profile.Height) - (5 * profile.Age) + 5;
            }
            else
            {
                profile.BMR = (10 * profile.Weight) + (6.25 * profile.Height) - (5 * profile.Age) - 161;
            }

            double multiplier = profile.ActivityLevel switch
            {
                ActivityLevel.Sedentary => 1.2,
                ActivityLevel.LightlyActive => 1.375,
                ActivityLevel.ModeratelyActive => 1.55,
                ActivityLevel.VeryActive => 1.725,
                ActivityLevel.ExtraActive => 1.9,
                _ => 1.2
            };

            profile.TDEE = profile.BMR * multiplier;

            if (profile.Goal == FitnessGoal.WeightLoss) profile.TDEE -= 500;
            else if (profile.Goal == FitnessGoal.MuscleGain) profile.TDEE += 300;
        }

        public double CalculateCaloriesBurned(double metValue, double weightKg, double durationSeconds)
        {
            return (metValue * 3.5 * weightKg) / 200 * (durationSeconds / 60);
        }
    }
}