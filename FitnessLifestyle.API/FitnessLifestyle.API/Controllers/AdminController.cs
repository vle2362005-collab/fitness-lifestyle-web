using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;

namespace FitnessLifestyle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email,
                    role = u.Role,
                })
                .ToListAsync();

            return Ok(users);
        }

 
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy tài khoản.");

            var currentUserId = User.FindFirst("userId")?.Value;
            if (currentUserId == id.ToString()) return BadRequest("Không thể tự xóa tài khoản của mình.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa tài khoản thành công!" });
        }
    }
}