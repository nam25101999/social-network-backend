import db from '../config/db.js';

// Gửi lời mời kết bạn
export const sendFriendRequest = (req, res) => {
  const sender_id = req.user.id;
  const { receiver_id } = req.body;

  if (sender_id === receiver_id) {
    return res.status(400).json({ message: 'Không thể gửi lời mời kết bạn đến chính mình.' });
  }

  const checkQuery = `SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ?`;
  db.query(checkQuery, [sender_id, receiver_id], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'Đã gửi lời mời kết bạn trước đó.' });
    }

    const insertQuery = `INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)`;
    db.query(insertQuery, [sender_id, receiver_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi gửi lời mời', error: err });
      res.status(201).json({ message: 'Đã gửi lời mời kết bạn!' });
    });
  });
};

// Xác nhận lời mời kết bạn
export const acceptFriendRequest = (req, res) => {
  const { request_id } = req.params;
  const userId = req.user.id;

  const updateQuery = `UPDATE friend_requests SET status = 'accepted' WHERE id = ? AND receiver_id = ?`;
  db.query(updateQuery, [request_id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi xác nhận lời mời', error: err });
    res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn.' });
  });
};

// Từ chối lời mời
export const rejectFriendRequest = (req, res) => {
  const { request_id } = req.params;
  const userId = req.user.id;

  const updateQuery = `UPDATE friend_requests SET status = 'rejected' WHERE id = ? AND receiver_id = ?`;
  db.query(updateQuery, [request_id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi từ chối lời mời', error: err });
    res.status(200).json({ message: 'Đã từ chối lời mời kết bạn.' });
  });
};

// Lấy danh sách lời mời kết bạn đang chờ
export const getPendingRequests = (req, res) => {
  const userId = req.user.id;

  const query = `SELECT fr.id, u.username, u.avatar 
    FROM friend_requests fr 
    JOIN users u ON u.id = fr.sender_id 
    WHERE fr.receiver_id = ? AND fr.status = 'pending'`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn lời mời', error: err });
    res.status(200).json({ requests: results });
  });
};
