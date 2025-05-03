import express from 'express';
import multer from 'multer';
import authenticate from '../middlewares/authenticate.js';
import { updateAvatar } from '../controllers/userController.js'; // Cập nhật import với hàm updateAvatar

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lưu trữ ảnh trong thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Đặt tên file theo thời gian
  }
});

// Khởi tạo upload middleware
const upload = multer({ storage });

// Tạo router
const router = express.Router();

// Tạo route upload ảnh đại diện
router.post('/avatar', authenticate, upload.single('avatar'), updateAvatar);

export default router;
