# Healthy Food Backend API

Backend API cho ứng dụng Healthy Food được xây dựng với Node.js, Express và MongoDB.

## Tính năng

- **Authentication**: Đăng ký, đăng nhập, JWT authentication
- **User Management**: Quản lý thông tin người dùng, đổi mật khẩu
- **Blog System**: CRUD operations cho bài viết blog
- **Category System**: Phân loại bài viết theo danh mục
- **Like System**: Thích/bỏ thích bài viết
- **Search**: Tìm kiếm bài viết
- **Pagination**: Phân trang cho danh sách bài viết

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcryptjs** - Mã hóa mật khẩu
- **CORS** - Cross-origin resource sharing

## Cài đặt

1. Clone repository
```bash
git clone <repository-url>
cd backend
```

2. Cài đặt dependencies
```bash
npm install
```

3. Tạo file `.env` và cấu hình biến môi trường:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthy-food
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Khởi động MongoDB server

5. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật thông tin user
- `PUT /api/auth/password` - Đổi mật khẩu

### Blog Posts
- `GET /api/blog` - Lấy danh sách bài viết
- `GET /api/blog/featured` - Lấy bài viết nổi bật
- `GET /api/blog/:id` - Lấy bài viết theo ID
- `POST /api/blog` - Tạo bài viết mới (yêu cầu authentication)
- `PUT /api/blog/:id` - Cập nhật bài viết (yêu cầu authentication)
- `DELETE /api/blog/:id` - Xóa bài viết (yêu cầu authentication)
- `PUT /api/blog/:id/like` - Thích/bỏ thích bài viết (yêu cầu authentication)

## Query Parameters

### GET /api/blog
- `category` - Lọc theo danh mục
- `parentCategory` - Lọc theo danh mục cha
- `search` - Tìm kiếm theo từ khóa
- `page` - Số trang (mặc định: 1)
- `limit` - Số bài viết mỗi trang (mặc định: 10)

## Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối MongoDB
├── controllers/
│   ├── authController.js    # Controller cho authentication
│   └── blogController.js    # Controller cho blog
├── middleware/
│   └── auth.js             # Middleware authentication
├── models/
│   ├── User.js             # Model User
│   └── BlogPost.js         # Model BlogPost
├── routes/
│   ├── auth.js             # Routes authentication
│   └── blog.js             # Routes blog
├── src/
│   └── server.js           # File server chính
├── .env                    # Biến môi trường
├── .gitignore
├── package.json
└── README.md
```

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi khởi động server
- Thay đổi `JWT_SECRET` trong file `.env` thành một chuỗi bảo mật
- Cấu hình CORS origin phù hợp với domain frontend của bạn
- Trong production, sử dụng MongoDB Atlas hoặc database cloud khác 