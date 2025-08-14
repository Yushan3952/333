const express = require('express');
const db = require('../utils/firebase');
const cloudinary = require('../utils/cloudinary');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const pointsCollection = db.collection('points');

// 驗證密碼 middleware
function checkPassword(req, res, next) {
  const password = req.headers['winnie3952'];
  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' });
  }
  next();
}

// 刪除點位
app.post('/delete', checkPassword, async (req, res) => {
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

app.listen(PORT, () => console.log(`Delete server running on port ${PORT}`));
