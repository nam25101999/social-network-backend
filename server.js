import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cấu hình dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3306;

// Cấu hình static cho thư mục /uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

// Import routes
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';

// Sử dụng routes
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentsRoutes);
app.get('/test', (req, res) => {
  res.send('API is working');
});
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
