using FitnessLifestyle.API.Models;

namespace FitnessLifestyle.API.Services
{
    public interface IFitnessService
    {
        void CalculateFitnessMetrics(MedicalProfile profile);
        double CalculateCaloriesBurned(double metValue, double weightKg, double durationSeconds);
    }
}