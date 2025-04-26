const express = require('express');
const app = express();
const port = 3000;

// Route cơ bản
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Lắng nghe server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});