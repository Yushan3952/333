const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v2: cloudinary } = require('cloudinary');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ 正確 Cloudinary 設定
cloudinary.config({
  cloud_name: 'dwhn02tn5',
  api_key: '222767751424686',
  api_secret: 'irVgEGZA-GfmrRJImjq7hwqz63U',
});

// ✅ 刪除圖片 API：不需要自己簽章，Cloudinary SDK 自動處理
app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: '缺少 public_id' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('✅ 刪除成功', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Cloudinary 刪除失敗', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
