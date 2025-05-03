import express from 'express';
import { addComment, getCommentsByPost } from '../controllers/commentsController.js';
import authenticateToken from '../middlewares/authenticate.js';

const router = express.Router();

// POST: Thêm bình luận cho bài viết
router.post('/posts/:postId/comments', authenticateToken, addComment);

// GET: Lấy danh sách bình luận của bài viết
router.get('/posts/:postId/comments', getCommentsByPost);

export default router;
