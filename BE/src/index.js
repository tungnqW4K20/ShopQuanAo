const express = require('express');
const db = require('./models');

const app = express();
const port = 3000;

app.use(express.json());

// Kết nối database và đồng bộ models
// Truy cập instance sequelize qua db.sequelize
db.sequelize.authenticate()
  .then(() => {
    console.log('Kết nối MySQL thành công bằng models/index.js!');
    // Đồng bộ tất cả các model đã được nạp bởi models/index.js
    // Bạn có thể thêm { force: true } hoặc { alter: true } nếu cần trong lúc dev
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Đồng bộ tất cả các bảng thành công!');
    // Khởi động server sau khi mọi thứ sẵn sàng
    app.listen(port, () => {
      console.log(`Server chạy tại http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Lỗi khởi tạo database:', err);
    process.exit(1); // Thoát ứng dụng nếu không kết nối/đồng bộ được DB
  });

// === Các Route Ví dụ ===

// Ví dụ với model Customer (đã tạo ở yêu cầu trước)
app.get('/customers', async (req, res) => {
  try {
    // Truy cập model Customer thông qua đối tượng db
    const customers = await db.Customer.findAll();
    res.json(customers);
  } catch (err) {
    console.error("Lỗi lấy danh sách customers:", err);
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});

// Ví dụ với model Product kèm Category
app.get('/products', async (req, res) => {
  try {
    // Truy cập model Product và Category thông qua db
    const products = await db.Product.findAll({
      include: [{ model: db.Category }] // Sử dụng association đã định nghĩa
    });
    res.json(products);
  } catch (err) {
    console.error("Lỗi lấy danh sách products:", err);
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});

// Nếu bạn thực sự có model User định nghĩa trong `models/user.js`
// thì route cũ của bạn sẽ hoạt động như sau:
app.get('/users', async (req, res) => {
  // Đảm bảo bạn có file models/user.js định nghĩa model User
  if (!db.User) {
     return res.status(404).json({ error: 'Model User không tồn tại.' });
  }
  try {
    // Truy cập model User thông qua đối tượng db
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    console.error("Lỗi lấy danh sách users:", err);
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});

// Thêm các routes và middleware khác của bạn ở đây...