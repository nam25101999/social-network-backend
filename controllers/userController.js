const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ĐĂNG KÝ
const register = async (req, res) => {
  const { fullName, email, password, birthDate, gender } = req.body;

  if (!fullName || !email || !password || !birthDate || !gender) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn.' });

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm người dùng mới vào database
      db.query(
        'INSERT INTO users (full_name, email, password, birth_date, gender) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, birthDate, gender],
        (err, result) => {
          if (err) {
            console.error('Lỗi khi tạo người dùng:', err);
            return res.status(500).json({ message: 'Lỗi khi tạo người dùng.' });
          }
          res.status(201).json({ message: 'Đăng ký thành công!', userId: result.insertId });
        }
      );
    });
  } catch (error) {
    console.error('Lỗi server:', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};


// ĐĂNG NHẬP + TẠO TOKEN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn.' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Sai mật khẩu.' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
};
// ĐĂNG XUẤT
const logout = (req, res) => {
  // Vì JWT lưu ở client, nên ở backend chỉ trả lời rằng client nên xoá token
  return res.status(200).json({ message: 'Đăng xuất thành công! Hãy xoá token ở phía client.' });
};

// Up Avatar
const updateAvatar = (req, res) => {
    const userId = req.user.id;
    const avatarPath = req.file ? req.file.filename : null;
  
    if (!avatarPath) {
      return res.status(400).json({ message: 'Vui lòng chọn ảnh đại diện.' });
    }
  
    const sql = 'UPDATE users SET avatar = ? WHERE id = ?';
    db.query(sql, [avatarPath, userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
      res.status(200).json({ message: 'Cập nhật ảnh đại diện thành công', avatar: avatarPath });
    });
  };
  // Lấy thông tin người dùng hiện tại từ token
const getUserInfo = (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM users WHERE id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      return res.status(500).json({ message: 'Lỗi server.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = results[0];

    // Ẩn thông tin theo thiết lập quyền riêng tư
    if (user.visibility_full_name === 'private') delete user.full_name;
    if (user.visibility_email === 'private') delete user.email;
    if (user.visibility_phone === 'private') delete user.phone;
    if (user.visibility_gender === 'private') delete user.gender;
    if (user.visibility_birth_date === 'private') delete user.birth_date;

    return res.status(200).json({ success: true, user });
  });
};

  
// Cập nhật thông tin cá nhân
const updateProfile = (req, res) => {
  const userId = req.user.id;
  const {
    full_name,
    email,
    phone,
    gender,
    birth_date,
    profile_picture,
    cover_photo,
    bio,
    status,
    username,
    avatar,
    visibility_full_name,
    visibility_email,
    visibility_phone,
    visibility_gender,
    visibility_birth_date
  } = req.body;

  const sql = `
    UPDATE users SET 
      full_name = ?, 
      email = ?, 
      phone = ?, 
      gender = ?, 
      birth_date = ?, 
      profile_picture = ?, 
      cover_photo = ?, 
      bio = ?, 
      status = ?, 
      username = ?, 
      avatar = ?,
      visibility_full_name = ?,
      visibility_email = ?,
      visibility_phone = ?,
      visibility_gender = ?,
      visibility_birth_date = ?
    WHERE id = ?
  `;

  const values = [
    full_name,
    email,
    phone,
    gender,
    birth_date,
    profile_picture,
    cover_photo,
    bio,
    status,
    username,
    avatar,
    visibility_full_name,
    visibility_email,
    visibility_phone,
    visibility_gender,
    visibility_birth_date,
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });
    }

    res.status(200).json({ message: 'Cập nhật thông tin thành công.' });
  });
};

module.exports = { register, login,updateAvatar,logout,getUserInfo,updateProfile };
