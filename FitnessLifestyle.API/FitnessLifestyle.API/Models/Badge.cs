using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessLifestyle.API.Models
{
    public class Badge
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? IconUrl { get; set; }
    }

    public class UserBadge
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BadgeId { get; set; }
        public DateTime EarnedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        [ForeignKey("BadgeId")]
        public virtual Badge? Badge { get; set; }
    }
}