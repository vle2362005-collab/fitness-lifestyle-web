# 🏋️‍♂️ TRUEFORM AI - HỆ SINH THÁI THỂ CHẤT THÔNG MINH

![TrueForm AI Banner](https://via.placeholder.com/1200x400.png?text=TRUEFORM+AI+-+FITNESS+%26+HEALTH+ECOSYSTEM)

> **Đồ án Lập trình Web**
> **Sinh viên thực hiện:** Lê Ngọc Quang Vinh
> **Nền tảng:** Next.js (Frontend) & C# ASP.NET Core (Backend)

---

## 🌟 GIỚI THIỆU DỰ ÁN
**TrueForm AI** là một ứng dụng Web toàn diện giúp người dùng quản lý quá trình luyện tập và dinh dưỡng. Điểm nhấn đặc biệt của hệ thống là tích hợp **Trí tuệ Nhân tạo (AI)** thông qua mô hình học máy **TensorFlow MoveNet**, cho phép nhận diện khung xương qua Camera thời gian thực, tự động chấm điểm tư thế, đếm số lần lặp lại (Reps) và chia hiệp (Sets) một cách chính xác mà không cần thiết bị cảm biến đắt tiền.

## 🚀 CÁC TÍNH NĂNG NỔI BẬT
* **🤖 AI Coach (Trợ lý ảo Camera):** Nhận diện 17 điểm neo trên cơ thể, đếm Reps/Sets thông minh dựa trên góc độ các khớp xương (Khuỷu tay, Đầu gối, Hông,...). Hỗ trợ cấu hình AI linh hoạt cho từng bài tập khác nhau.
* **🥗 Nhật ký Dinh dưỡng:** Theo dõi lượng Calories, Protein, Carbs, Fat nạp vào mỗi ngày với thanh tiến trình trực quan.
* **📊 Dashboard Thống kê:** Tổng hợp kết quả tập luyện, lượng Calories đốt cháy và thời gian hoạt động.
* **🛡️ Hệ thống Phân quyền (RBAC):** * **User:** Đăng nhập, theo dõi tiến độ, tập luyện cùng AI, ghi chép bữa ăn.
    * **Admin:** Quản lý toàn bộ tài khoản, thêm/sửa/xóa bài tập và cấu hình thuật toán AI cho bài tập.
* **💬 Chatbot Tích hợp:** Trợ lý ảo tư vấn thông tin ngay trên giao diện nền tảng.

## 🛠️ CÔNG NGHỆ SỬ DỤNG
**Frontend:**
* **Framework:** Next.js (React.js)
* **Styling:** Tailwind CSS, Lucide Icons
* **AI Model:** TensorFlow.js, Pose Detection (MoveNet)

**Backend:**
* **Framework:** C# ASP.NET Core Web API
* **Database:** SQL Server, Entity Framework Core
* **Security:** BCrypt (Hash Password), JWT Authentication

---

## ⚙️ HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 1. Yêu cầu hệ thống
* [Node.js](https://nodejs.org/) (Phiên bản 18+ trở lên)
* [.NET SDK](https://dotnet.microsoft.com/) (Phiên bản tương ứng với project)
* SQL Server & SQL Server Management Studio (SSMS)

### 2. Cài đặt Cơ sở dữ liệu
1. Mở SSMS.
2. Mở file `Database_Fitness&Lifestyle.sql` đính kèm trong mã nguồn.
3. Nhấn **Execute** (F5) để khởi tạo toàn bộ Cấu trúc bảng và Dữ liệu mẫu.

### 3. Khởi chạy Backend (API)
1. Mở thư mục `FitnessLifestyle.API` bằng Visual Studio.
2. Mở file `appsettings.json`, kiểm tra và cấu hình lại `DefaultConnection` sao cho khớp với Tên Server SQL của bạn.
3. Nhấn nút **Run** (Hoặc F5) để chạy Server API (thường chạy ở `https://localhost:7053` hoặc tương tự).

### 4. Khởi chạy Frontend (Giao diện)
1. Mở Terminal / Command Prompt, di chuyển vào thư mục `fitness-lifestyle-web`.
2. Chạy lệnh cài đặt thư viện:
   ```bash
   npm install
