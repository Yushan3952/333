// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = 3001;

// ✅ 直接寫入 Cloudinary 金鑰（已從你提供資訊整合）
cloudinary.config({
  cloud_name: 'dwhn02tn5',
  api_key: '你的 Cloudinary API Key',
  api_secret: '你的 Cloudinary API Secret',
});

app.use(cors());
app.use(bodyParser.json());

// ✅ 刪除圖片 API
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
  console.log(`後端伺服器已啟動：http://localhost:${PORT}`);
});
