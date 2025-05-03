import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// ĐĂNG KÝ
export const register = async (req, res) => {
  const { fullName, email, password, birthDate, gender } = req.body;

  if (!fullName || !email || !password || !birthDate || !gender) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn.' });

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (full_name, email, password, birth_date, gender) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, birthDate, gender],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Lỗi khi tạo người dùng.' });

          res.status(201).json({ message: 'Đăng ký thành công!', userId: result.insertId });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

// ĐĂNG NHẬP
export const login = (req, res) => {
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
export const logout = (req, res) => {
  return res.status(200).json({ message: 'Đăng xuất thành công! Hãy xoá token ở phía client.' });
};

// CẬP NHẬT AVATAR
export const updateAvatar = (req, res) => {
  const userId = req.user.id;
  const avatarPath = req.file ? req.file.filename : null;

  if (!avatarPath) {
    return res.status(400).json({ message: 'Vui lòng chọn ảnh đại diện.' });
  }

  db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
    res.status(200).json({ message: 'Cập nhật ảnh đại diện thành công', avatar: avatarPath });
  });
};

// LẤY THÔNG TIN NGƯỜI DÙNG
export const getUserInfo = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server.' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = results[0];

    if (user.visibility_full_name === 'private') delete user.full_name;
    if (user.visibility_email === 'private') delete user.email;
    if (user.visibility_phone === 'private') delete user.phone;
    if (user.visibility_gender === 'private') delete user.gender;
    if (user.visibility_birth_date === 'private') delete user.birth_date;

    return res.status(200).json({ success: true, user });
  });
};

// CẬP NHẬT THÔNG TIN
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const {
    full_name, email, phone, gender, birth_date, profile_picture,
    cover_photo, bio, status, username, avatar,
    visibility_full_name, visibility_email, visibility_phone,
    visibility_gender, visibility_birth_date
  } = req.body;

  const sql = `
    UPDATE users SET 
      full_name = ?, email = ?, phone = ?, gender = ?, birth_date = ?, 
      profile_picture = ?, cover_photo = ?, bio = ?, status = ?, 
      username = ?, avatar = ?,
      visibility_full_name = ?, visibility_email = ?, visibility_phone = ?, 
      visibility_gender = ?, visibility_birth_date = ?
    WHERE id = ?
  `;

  const values = [
    full_name, email, phone, gender, birth_date, profile_picture, cover_photo,
    bio, status, username, avatar,
    visibility_full_name, visibility_email, visibility_phone,
    visibility_gender, visibility_birth_date,
    userId
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });

    res.status(200).json({ message: 'Cập nhật thông tin thành công.' });
  });
};
