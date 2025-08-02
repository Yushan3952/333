// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ 使用你的 Cloudinary 金鑰
cloudinary.config({
  cloud_name: 'dwhn02tn5',
  api_key: '563586351398427',
  api_secret: 'y4T3bAvW6PSdfM2xC8cES0J_J6E'
});

app.use(cors());
app.use(bodyParser.json());

// ✅ Cloudinary 刪除 API
app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: '缺少 public_id' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok') throw new Error('Cloudinary 刪除失敗');

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || '圖片刪除失敗' });
  }
});

app.listen(PORT, () => {
  console.log(`後端 API 已啟動：http://localhost:${PORT}`);
});
