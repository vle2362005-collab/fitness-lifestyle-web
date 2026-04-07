using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;
using FitnessLifestyle.API.Models;

namespace FitnessLifestyle.API.Controllers
{
    public class LogNutritionDto
    {
        public int FoodId { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NutritionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NutritionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNutritionLogs()
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var logs = await _context.NutritionLogs
                .Include(n => n.Food)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.Date)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPost]
        public async Task<IActionResult> LogNutrition(LogNutritionDto request)
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var log = new NutritionLog
            {
                UserId = userId,
                FoodId = request.FoodId,
                Date = DateTime.UtcNow
            };

            _context.NutritionLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lưu bữa ăn thành công!" });
        }
    }
}