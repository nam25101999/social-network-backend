import express from 'express';
import { 
    register,
    login, 
    updateAvatar,
    logout,
    getUserInfo,
    updateProfile,
} from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Đăng ký và đăng nhập
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getUserInfo);
router.put('/update', authenticate, updateProfile);

// Route test bảo mật (chỉ cho người dùng đã đăng nhập)
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Lấy thông tin người dùng thành công!',
    user: req.user
  });
});

// Đổi avatar
router.post('/avatar', authenticate, upload.single('avatar'), updateAvatar);

export default router;
