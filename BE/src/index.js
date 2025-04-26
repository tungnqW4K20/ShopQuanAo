const express = require('express');
const sequelize = require('./config/db');
const User = require('./models/user');

const app = express();
const port = 3000;

app.use(express.json());

// Kết nối database
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối MySQL thành công!');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Đồng bộ bảng thành công!');
    app.listen(port, () => {
      console.log(`Server chạy tại http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Lỗi:', err);
  });

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Có lỗi xảy ra' });
  }
});
