// ✅ 匯入必要模組
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

// ✅ 建立 Express 應用程式
const app = express();
const PORT = process.env.PORT || 3001;

// ✅ 設定 Cloudinary 金鑰（使用者提供）
cloudinary.config({
  cloud_name: 'dwhn02tn5',
  api_key: '222767751424686',
  api_secret: 'irVgEGZA-GfmrRJImjq7hwqz63U',
});

// ✅ 中介軟體
app.use(cors());
app.use(bodyParser.json());

// ✅ 刪除圖片 API 路由
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

// ✅ 啟動伺服器
app.listen(PORT, () => {
  console.log(`✅ Cloudinary 刪除 API 已啟動：http://localhost:${PORT}`);
});
