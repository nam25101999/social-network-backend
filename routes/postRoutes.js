import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import postController from '../controllers/postController.js';

const router = express.Router();

router.post('/', authenticate, postController.createPost);
router.get('/me', authenticate, postController.getMyPosts);
router.get('/user/:userId', postController.getPostsByUser);
router.get('/', postController.getAllPosts);

export default router;
