import db from '../utils/firebase.js';
import cloudinary from '../utils/cloudinary.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: '只支援 POST' });

  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) return res.status(401).json({ error: '密碼錯誤' });

  const { id, publicId } = req.body;
  if (!id) return res.status(400).json({ error: '需要 id' });

  try {
    // 刪 Firebase document
    await db.collection('points').doc(id).delete();

    // 刪 Cloudinary 圖片（如果有提供 publicId）
    if (publicId) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'not found') {
          console.warn(`Cloudinary 找不到檔案 ${publicId}`);
        }
      } catch (err) {
        console.warn(`Cloudinary 刪除錯誤: ${err.message}`);
      }
    }

    res.status(200).json({ success: true, message: `已刪除點位 ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

