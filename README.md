# HealthyFood

HealthyFood là ứng dụng web giúp người dùng quản lý sức khỏe, dinh dưỡng, theo dõi chỉ số cơ thể, nhật ký ăn uống và đọc các bài viết blog về thực phẩm, dinh dưỡng, sức khỏe.

---

## Tính năng nổi bật

- **Đăng ký / Đăng nhập / Quản lý tài khoản**
- **Dashboard tổng quan sức khỏe**: Biểu đồ chỉ số cơ thể, xu hướng sức khỏe, thống kê dinh dưỡng.
- **Nhật ký thực phẩm**: Theo dõi món ăn hàng ngày, lượng calo, protein, carbs, fat, chất xơ.
- **Tính toán chỉ số calo, BMI, BMR**: Đặt mục tiêu dinh dưỡng cá nhân.
- **Blog dinh dưỡng**: Đọc, tìm kiếm, lọc các bài viết về thực phẩm, chế độ ăn, kiến thức sức khỏe.
- **Quản lý chỉ số cơ thể**: Lưu lịch sử cân nặng, chiều cao, BMI, body fat...
- **Gợi ý món ăn**: Theo mục tiêu dinh dưỡng và sở thích cá nhân.

---

## Công nghệ sử dụng

- **Frontend**: ReactJS, TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Chart**: SVG custom
- **Xác thực**: React Context API

---

## Cài đặt & chạy dự án

### 1. Clone project

```bash
git clone https://github.com/yourusername/HealthyFood.git
cd HealthyFood
```

### 2. Cài đặt backend

```bash
cd backend
npm install
```

- Tạo file `.env` và cấu hình biến môi trường (ví dụ MongoDB URI, JWT_SECRET):

```env
MONGODB_URI=mongodb://localhost:27017/healthyfood
JWT_SECRET=your_jwt_secret
```

- Khởi động backend

```bash
npm start
```

### 3. Cài đặt frontend

```bash
cd ../frontend
npm install
```

- Khởi động frontend

```bash
npm run dev
```

- Truy cập: [http://localhost:ip_cua_ban]

---

## Cấu trúc thư mục HealthyFood

```
HealthyFood/
├── backend/
│   ├── controllers/         # Các controller xử lý logic cho API
│   ├── models/              # Định nghĩa các schema/model MongoDB
│   ├── routes/              # Định nghĩa các route cho API
│   ├── middleware/          # Các middleware (auth, error, ... )
│   ├── utils/               # Các hàm tiện ích dùng chung
│   ├── config/              # Cấu hình kết nối DB, biến môi trường
│   ├── app.js               # File khởi tạo Express app
│   ├── server.js            # File chạy server backend
│   └── ...                  # Các file khác (README.md, .env.example, ...)
│
├── frontend/
│   ├── public/              # Ảnh, favicon, file tĩnh
│   ├── src/
│   │   ├── assets/          # Ảnh, icon, logo dùng trong FE
│   │   ├── components/
│   │   │   ├── auth/        # Component liên quan xác thực (ProtectedRoute, ...)
│   │   │   ├── common/      # Component dùng chung (Header, Footer, Button, ...)
│   │   │   └── ...          # Component khác
│   │   ├── contexts/        # React Context (AuthContext, ...)
│   │   ├── layouts/         # Layout cho các trang (UserLayout, ...)
│   │   ├── pages/
│   │   │   ├── blog/        # Trang blog (Blog.jsx, BlogDetail.jsx, ...)
│   │   │   ├── dashboard/   # Trang dashboard tổng quan
│   │   │   ├── account/     # Trang tài khoản người dùng
│   │   │   ├── calories/    # Trang chỉ số calo
│   │   │   ├── body-index/  # Trang chỉ số cơ thể
│   │   │   └── ...          # Các trang khác
│   │   ├── services/        # Gọi API (blogService.js, authService.js, ...)
│   │   ├── App.jsx          # Component gốc của FE
│   │   ├── main.jsx         # File khởi tạo React app
│   │   └── ...              # Các file khác
│   ├── package.json         # Cấu hình npm cho FE
│   └── ...                  # Các file khác (README.md, vite.config.js, ...)
│
├── README.md                # Hướng dẫn sử dụng chung cho project
└── ...                      # Các file/thư mục
```
---

## Một số file quan trọng

- `frontend/src/contexts/AuthContext.jsx`: Quản lý trạng thái xác thực người dùng.
- `frontend/src/components/auth/ProtectedRoute.jsx`: Bảo vệ các route cần đăng nhập.
- `frontend/src/pages/Dashboard.jsx`: Trang tổng quan sức khỏe.
- `frontend/src/pages/blog/Blog.jsx`: Trang blog dinh dưỡng.
- `frontend/src/services/blogService.js`: Giao tiếp API blog.
- `frontend/src/components/common/Header.jsx`: Header của ứng dụng.

---

## Đóng góp

- Fork, tạo nhánh mới, pull request.
- Báo lỗi hoặc đề xuất tính năng qua Issues.

## Update
- Chỉnh sửa trang calo calculation  cho phù hợp với thực tế.
- Update database để đa dạng hóa cho user.
- Cần tối ưu hiệu suất của code để có thể đưa vào thực tế.(db, frontend).
- Trong tương lai có thể làm trang admin.

---

## License

MIT License

---

**Liên hệ:**  
- Email: tungonlytop1@email.com  
- Facebook: fb.com/profile  
- Website: healthyfood.example.com

---

> Cảm ơn bạn đã sử dụng HealthyFood!  
> Chúc bạn luôn khỏe mạnh và ăn uống lành mạnh!
