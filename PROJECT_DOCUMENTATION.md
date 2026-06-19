# G.I.F (Hyper-Performance AI Fitness) - Project Documentation

## 1. Giới Thiệu (Introduction)
G.I.F là một ứng dụng di động theo dõi tập luyện thể hình hiện đại, được thiết kế theo phong cách Futuristic Glassmorphism (Giao diện trong suốt tương lai). Ứng dụng hoạt động như một "trung tâm chỉ huy sinh trắc học" cá nhân, kết hợp sức mạnh của Trí Tuệ Nhân Tạo (Groq Llama 3.1) để thiết kế lịch tập luyện cá nhân hóa, đồng thời theo dõi sát sao tiến độ phục hồi và mức độ sẵn sàng của cơ thể mỗi ngày.

## 2. Phạm Vi Dự Án (Project Scope)
Dự án tập trung vào trải nghiệm tập luyện cá nhân (Personal Fitness Tracking), bao gồm các hạng mục cốt lõi:
- Thu thập chỉ số và mục tiêu cá nhân của người dùng.
- Sử dụng AI để tự động sinh ra lộ trình tập luyện linh hoạt.
- Cỗ máy tập luyện (Workout Engine) theo dõi trực tiếp thời gian, khối lượng tạ, và thời gian nghỉ của từng hiệp.
- Bảng điều khiển (Dashboard) phân tích chuỗi ngày tập (Streak), điểm sẵn sàng (Readiness), và bản đồ phục hồi cơ bắp (Recovery Map).

## 3. Link Figma
- [Điền link bản thiết kế Figma của bạn vào đây]

## 4. Link Github
- [Điền link repository Github của bạn vào đây]

## 5. Kỹ Thuật (Technical Stack)
Dự án được xây dựng trên hệ sinh thái React Native cực kỳ tối ưu và hiện đại:
- **Framework Core:** React Native 0.85 & Expo SDK 56.
- **Routing:** Expo Router (File-based routing).
- **UI & Styling:** Tailwind CSS (qua NativeWind) & GluestackUI.
- **State Management:** Zustand (Global State) & React Query (Data Fetching).
- **Authentication:** Clerk (Email/Password & Google OAuth).
- **Database:** Firebase Firestore (Client SDK).
- **AI Integration:** Groq API (sử dụng model Llama-3.1-8b-instant).

## 6. Các Tính Năng & Màn Hình Đã Hoàn Thành
- **Luồng Đăng Nhập (Auth):**
  - Màn hình Sign-in / Sign-up (đã tích hợp Clerk).
- **Luồng Khởi Tạo (Onboarding):**
  - Khảo sát mục tiêu tập luyện (Setup Goal).
  - Thu thập chỉ số cơ thể (Setup Profile).
- **Màn Hình Trang Chủ (Home Dashboard):**
  - Biểu đồ điểm Sẵn Sàng (Readiness Score).
  - Biểu đồ theo dõi chuỗi ngày tập (Streak Tracking).
  - Bản đồ phục hồi nhóm cơ (Recovery Map).
  - Hiển thị lịch tập AI hôm nay.
- **Cỗ Máy Tập Luyện (Workout Session Engine):**
  - Giao diện đếm ngược tự động (Timer) cho các bài Cardio/Plyometrics.
  - Giao diện điền Tạ (KG) và Số lần (REPS) cho bài tập sức mạnh. Tự động ẩn KG nếu là bài Bodyweight.
  - Xử lý chuyển đổi State: Chuẩn bị (Preparing) -> Tập (Active) -> Nghỉ (Resting).
  - Màn hình Ăn mừng hoàn thành buổi tập (Session Complete).
- **Luồng Lịch Sử (Progress):**
  - Danh sách các buổi tập đã hoàn thành.
  - Chi tiết từng buổi tập (Session Details).

## 7. Các Tính Năng & Màn Hình Chưa Hoàn Thành
*(Dưới đây là một số tính năng có thể xem xét phát triển thêm, bạn có thể chỉnh sửa tùy theo kế hoạch thực tế)*
- Màn hình Settings chuyên sâu (Đổi mật khẩu, xóa tài khoản, sửa đổi các chỉ số cơ thể cũ).
- Chế độ Offline Mode (Lưu cache bài tập khi không có mạng và đồng bộ sau lên Firebase).
- Thư viện bài tập chi tiết (Tra cứu hình ảnh/video hướng dẫn từng bài tập).
- Màn hình chia sẻ thành tích lên Mạng Xã Hội.

## 8. Các Bước Tiếp Theo (Next Actions)
1. Cập nhật các Link Figma và Github vào tài liệu này.
2. Kiểm thử thực tế (QA/Testing) toàn bộ luồng tạo lịch AI và lưu Log tập luyện.
3. Hoàn thiện nội dung database (Seed Data) cho thư viện bài tập (`exercise_library`) với đầy đủ video/hình ảnh minh họa.
4. Triển khai các tính năng ở mục số 7 (nếu có trong kế hoạch).
5. Build ứng dụng ra file APK (Android) / TestFlight (iOS) để chạy thử nghiệm diện rộng.
