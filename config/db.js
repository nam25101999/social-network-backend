import dotenv from 'dotenv';

dotenv.config();

// Kiểm tra nếu không có MySQL thì bỏ qua kết nối
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
  const mysql = require('mysql2');
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) throw err;
    console.log('✅ Kết nối MySQL thành công!');
  });
}

export default null;  // Nếu không sử dụng DB, có thể trả về null
