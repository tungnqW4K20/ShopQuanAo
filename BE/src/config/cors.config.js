const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174'], // Cho phép frontend truy cập (Vite thường dùng port 5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Cho phép gửi cookie hoặc token
};

module.exports = cors(corsOptions);
