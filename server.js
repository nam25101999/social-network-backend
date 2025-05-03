const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3306;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));// Cho phép truy cập ảnh avatar qua URL


// Routes users
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
//friend
const friendRoutes = require('./routes/friendRoutes');
app.use('/api/friends', friendRoutes);
//post
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);
const commentsRoutes = require('./routes/commentsRoutes');
app.use('/api', commentsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
