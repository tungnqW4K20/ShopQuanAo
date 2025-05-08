require('dotenv').config();
const corsMiddleware = require('./config/cors.config');
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');

const supplierRoutes = require('./routes/supplier.routes');
const app = express();
const port = process.env.PORT || 3001;

app.use(corsMiddleware);

app.use(express.json()); // Middleware để parse JSON request body


// --- Kết nối DB và khởi động Server ---
db.sequelize.authenticate()
  .then(() => {
    console.log('Kết nối MySQL thành công!');
    // return db.sequelize.sync({ alter: true }); // Dùng alter hoặc không sync ở đây nếu dùng migrations
    return db.sequelize.sync(); // Đồng bộ để tạo bảng nếu chưa có
     //return db.sequelize.sync({ alter: true }); // thay đổi cấu trúc bảng
  })
  .then(() => {
    console.log('Đồng bộ bảng thành công!');

    // --- Sử dụng Routes ---
    app.use('/api/auth', authRoutes); // Gắn auth routes vào đường dẫn /api/auth
    app.use('/api/categories', categoryRoutes);
    app.use('/api/suppliers', supplierRoutes);
    // Ví dụ về route được bảo vệ (sẽ tạo middleware sau)
    // const { authenticateToken } = require('./middleware/auth.middleware');
    // app.get('/api/profile', authenticateToken, (req, res) => {
    //   // req.user được thêm vào bởi middleware authenticateToken
    //   res.json({ message: "Đây là trang profile", user: req.user });
    // });
    

    app.listen(port, () => {
      console.log(`Server chạy tại http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Lỗi khởi tạo:', err);
    process.exit(1);
  });

// Middleware xử lý lỗi chung (tùy chọn)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});