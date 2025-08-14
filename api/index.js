const express = require('express');
const db = require('../utils/firebase');
const cloudinary = require('../utils/cloudinary');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pointsCollection = db.collection('points');

// 驗證密碼 middleware
function checkPassword(req, res, next) {
  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' });
  }
  next();
}

// 首頁提示
app.get('/', (req, res) => {
  res.send('<h1>後端 API 正常運作</h1><p>請使用 /api/points 或 /api/delete 呼叫 API，Header 輸入 x-password</p>');
});

// 列出所有點位
app.get('/api/points', checkPassword, async (req, res) => {
  try {
    const snapshot = await pointsCollection.get();
    const points = [];
    snapshot.forEach(doc => points.push({ id: doc.id, ...doc.data() }));
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 刪除指定點位
app.post('/api/delete', checkPassword, async (req, res) => {
  const { id, publicId } = req.body;
  if (!id) return res.status(400).json({ error: '需要 id' });

  try {
    // 刪 Firebase document
    await pointsCollection.doc(id).delete();
    // 刪 Cloudinary 圖片
    if (publicId) await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: `已刪除點位 ${id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
