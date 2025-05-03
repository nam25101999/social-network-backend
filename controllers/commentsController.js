import db from '../config/db.js'; // Cập nhật theo chuẩn ES Module

// Thêm bình luận
export const addComment = (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: 'Nội dung bình luận là bắt buộc.' });
  }

  const sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
  db.query(sql, [postId, userId, content], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi thêm bình luận.' });
    res.status(201).json({ message: 'Bình luận đã được thêm!', commentId: result.insertId });
  });
};

// Lấy danh sách bình luận theo bài viết
export const getCommentsByPost = (req, res) => {
  const postId = req.params.postId;

  const sql = `
    SELECT comments.*, users.full_name, users.username, users.profile_picture
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.post_id = ? 
    ORDER BY comments.created_at DESC
  `;

  db.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy bình luận.' });
    res.status(200).json({ comments: results });
  });
};

export default {
  getCommentsByPost,
  addComment,
};
