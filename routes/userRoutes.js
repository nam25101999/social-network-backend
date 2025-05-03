const express = require('express');
const router = express.Router();
const { 
    register,
    login, 
    updateAvatar,
    logout,
    getUserInfo,
    updateProfile,
     } = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Đăng ký và đăng nhập
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate,getUserInfo);
router.put('/update', authenticate,updateProfile);

// Route test bảo mật (chỉ cho người dùng đã đăng nhập)
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Lấy thông tin người dùng thành công!',
    user: req.user
  });
});
// Đổi avatar
router.post('/avatar', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
