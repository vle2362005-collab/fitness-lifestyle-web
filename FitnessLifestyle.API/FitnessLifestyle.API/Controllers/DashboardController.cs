using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;
using System.Security.Claims;

namespace FitnessLifestyle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSummary()
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdString, out int userId))
                return Unauthorized("Không tìm thấy userId trong Token.");

            var totalWorkouts = await _context.WorkoutSessions
                .Where(w => w.UserId == userId)
                .CountAsync();

            var caloriesBurned = await _context.WorkoutSessions
                .Where(w => w.UserId == userId)
                .SumAsync(w => (double?)w.CaloriesBurned) ?? 0;

            var totalMinutes = await _context.WorkoutSessions
                .Where(w => w.UserId == userId)
                .SumAsync(w => (int?)w.DurationMinutes) ?? 0;

            var recentWorkouts = await _context.WorkoutSessions
                .Include(w => w.Exercise)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.Date)
                .Take(5)
                .Select(w => new {
                    w.Id,
                    ExerciseName = w.Exercise.Name,
                    w.DurationMinutes,
                    w.CaloriesBurned,
                    w.Date
                })
                .ToListAsync();

            return Ok(new
            {
                totalWorkouts = totalWorkouts,
                caloriesBurned = caloriesBurned,
                totalMinutes = totalMinutes,
                recentWorkouts = recentWorkouts
            });
        }
    }
}