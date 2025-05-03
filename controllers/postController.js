import db from '../config/db.js';

// Tạo bài viết mới
export const createPost = (req, res) => {
  const { content, image_url } = req.body;
  const user_id = req.user.id;

  if (!content && !image_url) {
    return res.status(400).json({ message: 'Nội dung hoặc hình ảnh là bắt buộc.' });
  }

  const sql = "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)";
  db.query(sql, [user_id, content, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi tạo bài viết.' });
    res.status(201).json({ message: 'Tạo bài viết thành công!', postId: result.insertId });
  });
};

// Lấy bài viết của người đang đăng nhập
export const getMyPosts = (req, res) => {
  const sql = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy bài viết.' });
    res.json({ posts: results });
  });
};

// Lấy bài viết của người khác
export const getPostsByUser = (req, res) => {
  const sql = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy bài viết người dùng.' });
    res.json({ posts: results });
  });
};
export default {
  createPost,
  getMyPosts,
  getPostsByUser
};
