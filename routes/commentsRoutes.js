// routes/commentsRoutes.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const authenticateToken = require('../middlewares/authenticate');

// POST: Thêm bình luận cho bài viết
router.post('/posts/:postId/comments', authenticateToken, commentsController.addComment);

// GET: Lấy danh sách bình luận của bài viết
router.get('/posts/:postId/comments', commentsController.getCommentsByPost);

module.exports = router;
