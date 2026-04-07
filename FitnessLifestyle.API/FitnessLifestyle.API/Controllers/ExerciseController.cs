using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;
using FitnessLifestyle.API.Models;

namespace FitnessLifestyle.API.Controllers
{
    public class ExerciseUploadDto
    {
        public string Name { get; set; } = string.Empty;
        public double CaloriesPerMinute { get; set; }
        public string? AiConfig { get; set; }
        public string Description { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; } 
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ExerciseController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Exercises.OrderByDescending(e => e.Id).ToListAsync());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] ExerciseUploadDto request)
        {
            string imageUrl = ""; 

            if (request.ImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ImageFile.CopyToAsync(fileStream);
                }

                imageUrl = "http://localhost:7053/uploads/" + uniqueFileName;
            }

            var exercise = new Exercise
            {
                Name = request.Name,
                CaloriesPerMinute = (int)request.CaloriesPerMinute,
                Description = request.Description,
           
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm thành công!" });
        }
        
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] ExerciseUploadDto request)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return NotFound(new { message = "Không tìm thấy bài tập." });

            exercise.Name = request.Name;
            exercise.CaloriesPerMinute = (int)request.CaloriesPerMinute;
            exercise.Description = request.Description;
            exercise.AiConfig = request.AiConfig; 

            if (request.ImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ImageFile.CopyToAsync(fileStream);
                }

                exercise.ImageUrl = "http://localhost:7053/uploads/" + uniqueFileName;
            }
        
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật bài tập thành công!" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null) return NotFound();
            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa!" });
        }
    }
}