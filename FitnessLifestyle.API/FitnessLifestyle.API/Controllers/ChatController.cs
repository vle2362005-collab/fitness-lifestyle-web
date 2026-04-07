using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessLifestyle.API.Controllers
{
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ChatController : ControllerBase
    {
        [HttpPost("ask")]
        public async Task<IActionResult> AskAssistant([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Bạn chưa nhập câu hỏi.");

            await Task.Delay(500);

            string userMsg = request.Message.ToLower().Trim();
            if (userMsg.Contains("chào"))
                return Ok(new
                {
                    reply = "Chào bạn! Mình là Trợ lý AI của TrueForm: -- Giảm cân, Tăng cơ hay Thực đơn --👋",
                    options = new[] { "Giảm cân", "Tăng cơ", "Thực đơn" }
                });
            if (userMsg.Contains("giảm cân"))
            {
                return Ok(new
                {
                    reply = "Bạn muốn hỏi gì về giảm cân?" +
                    "Ăn gì" +
                    "Tập gì" +
                    "Bao lâu",

                    options = new[]
                    {
                        "Ăn gì ",
                        "Tập gì ",
                        "Bao lâu ",
                        "Có nên "
                    }
                });
            }

            if (userMsg.Contains("tăng cơ"))
            {
                return Ok(new
                {
                    reply = "Bạn muốn hỏi gì về tăng cơ?",
                    options = new[]
                    {
                        "Ăn gì để tăng cơ?",
                        "Bao nhiêu protein?",
                        "Tập mấy buổi?",
                        "Bao lâu có kết quả?"
                    }
                });
            }

            if (userMsg.Contains("thực đơn"))
            {
                return Ok(new
                {
                    reply = "Bạn muốn xem thực đơn nào?",
                    options = new[]
                    {
                        "Thực đơn giảm cân",
                        "Thực đơn tăng cơ",
                        "Ăn trước khi tập",
                        "Ăn sau khi tập"
                    }
                });
            }
            if (userMsg.Contains("ăn gì để giảm cân"))
                return Ok(new { reply = "Bạn nên ăn ức gà, trứng, rau xanh và hạn chế đồ chiên dầu." });

            if (userMsg.Contains("tập gì để giảm cân"))
                return Ok(new { reply = "Bạn nên tập cardio như chạy bộ, đạp xe kết hợp tập tạ nhẹ." });

            if (userMsg.Contains("bao lâu giảm cân"))
                return Ok(new { reply = "Bạn có thể thấy kết quả sau 4-8 tuần nếu kiên trì." });

            if (userMsg.Contains("ăn tối"))
                return Ok(new { reply = "Ăn tối không làm bạn mập, quan trọng là tổng calo trong ngày." });

            if (userMsg.Contains("ăn gì để tăng cơ"))
                return Ok(new { reply = "Bạn nên ăn nhiều protein từ thịt, cá, trứng và tinh bột tốt." });

            if (userMsg.Contains("bao nhiêu protein"))
                return Ok(new { reply = "Bạn cần 1.6 - 2.2g protein/kg thể trọng mỗi ngày." });

            if (userMsg.Contains("tập mấy buổi"))
                return Ok(new { reply = "Bạn nên tập 3-5 buổi/tuần để tăng cơ hiệu quả." });

            if (userMsg.Contains("bao lâu có kết quả"))
                return Ok(new { reply = "Bạn sẽ thấy kết quả sau 4-8 tuần nếu tập đúng cách." });

            if (userMsg.Contains("thực đơn giảm cân"))
                return Ok(new { reply = "Sáng: trứng + bánh mì, Trưa: ức gà + rau, Tối: cá + salad." });

            if (userMsg.Contains("thực đơn tăng cơ"))
                return Ok(new { reply = "Sáng: yến mạch + trứng, Trưa: thịt bò + cơm, Tối: cá + khoai." });

            if (userMsg.Contains("ăn trước khi tập"))
                return Ok(new { reply = "Ăn nhẹ trước 30-60 phút với chuối hoặc bánh mì." });

            if (userMsg.Contains("ăn sau khi tập"))
                return Ok(new { reply = "Ăn protein + tinh bột như ức gà + cơm để phục hồi cơ." });

            if (userMsg.Contains("đau lưng"))
                return Ok(new { reply = "Nếu bạn bị đau lưng, hãy tránh bài tập nặng và tập nhẹ như plank hoặc yoga." });

            if (userMsg.Contains("đau cơ"))
                return Ok(new { reply = "Đau cơ sau tập là bình thường, bạn nên nghỉ và giãn cơ." });

            if (userMsg.Contains("đau") && userMsg.Contains("tập"))
                return Ok(new { reply = "Nếu đau nhẹ có thể tập nhẹ, đau nhiều nên nghỉ ngơi." });

            return Ok(new
            {
                reply = "Bạn muốn tư vấn về gì?",
                options = new[] { "Giảm cân", "Tăng cơ", "Thực đơn" }
            });
        }
    }
}