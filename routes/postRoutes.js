const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const postController = require('../controllers/postController');

// Tạo bài viết mới
router.post('/', authenticate, postController.createPost);

// Lấy tất cả bài viết của user
router.get('/me', authenticate, postController.getMyPosts);

// Lấy bài viết theo user ID
router.get('/user/:userId', postController.getPostsByUser);

module.exports = router;
