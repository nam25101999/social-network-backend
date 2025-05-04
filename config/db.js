import mysql from 'mysql2';
import dotenv from 'dotenv';

// Đọc các biến môi trường từ tệp .env
dotenv.config();

// Tạo kết nối với MySQL sử dụng các biến môi trường
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,         // Sử dụng MYSQL_HOST thay cho DB_HOST
  user: process.env.MYSQL_USER,         // Sử dụng MYSQL_USER thay cho DB_USER
  password: process.env.MYSQL_PASSWORD, // Sử dụng MYSQL_PASSWORD thay cho DB_PASSWORD
  database: process.env.MYSQL_DATABASE, // Sử dụng MYSQL_DATABASE thay cho DB_NAME
});

// Kết nối đến cơ sở dữ liệu MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('✅ Kết nối MySQL thành công!');
});

export default db;
