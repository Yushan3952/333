// /api/delete-image.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法錯誤' });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: '缺少 public_id' });
  }

  const cloudinary = require('cloudinary').v2;

  cloudinary.config({
    cloud_name: 'dwhn02tn5',
    api_key: '899978884379254',
    api_secret: 'N4OYQ4knD1T8FejxI7S0kACfXOU',
  });

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Cloudinary 刪除失敗：' + result.result);
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || '圖片刪除失敗' });
  }
}
