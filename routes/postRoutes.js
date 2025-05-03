import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import postController from '../controllers/postController.js';

const router = express.Router();

// Tạo bài viết mới
router.post('/', authenticate, postController.createPost);

// Lấy tất cả bài viết của user
router.get('/me', authenticate, postController.getMyPosts);

// Lấy bài viết theo user ID
router.get('/user/:userId', postController.getPostsByUser);

export default router;
