using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;
using FitnessLifestyle.API.Models;

namespace FitnessLifestyle.API.Controllers
{
    public class LogWorkoutDto
    {
        public int ExerciseId { get; set; }
        public int DurationMinutes { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> LogWorkout(LogWorkoutDto request)
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var exercise = await _context.Exercises.FindAsync(request.ExerciseId);
            if (exercise == null) return NotFound("Không tìm thấy bài tập này.");

            double calculatedCalories = exercise.CaloriesPerMinute * request.DurationMinutes;

            var session = new WorkoutSession
            {
                UserId = userId,
                ExerciseId = request.ExerciseId,
                DurationMinutes = request.DurationMinutes,
                CaloriesBurned = calculatedCalories,
                Date = DateTime.UtcNow
            };

            _context.WorkoutSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lưu bài tập thành công!", caloriesBurned = calculatedCalories });
        }
    }
}