using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessLifestyle.API.Data;
using FitnessLifestyle.API.Models;
using FitnessLifestyle.API.Services;

namespace FitnessLifestyle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFitnessService _fitnessService;

        public ProfileController(ApplicationDbContext context, IFitnessService fitnessService)
        {
            _context = context;
            _fitnessService = fitnessService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<MedicalProfile>> GetProfile(int userId)
        {
            var profile = await _context.MedicalProfiles.FindAsync(userId);
            if (profile == null) return NotFound();
            return profile;
        }

        [HttpPost]
        public async Task<ActionResult<MedicalProfile>> UpdateProfile(MedicalProfile profile)
        {
            _fitnessService.CalculateFitnessMetrics(profile);

            var existingProfile = await _context.MedicalProfiles.FindAsync(profile.UserId);
            if (existingProfile == null)
            {
                _context.MedicalProfiles.Add(profile);
            }
            else
            {
                _context.Entry(existingProfile).CurrentValues.SetValues(profile);
            }

            await _context.SaveChangesAsync();
            return Ok(profile);
        }
    }
}