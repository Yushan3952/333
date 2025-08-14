import db from '../utils/firebase.js';
import cloudinary from '../utils/cloudinary.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: '只支援 POST' });

  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' });
  }

  const { id, publicId } = req.body;
  if (!id) return res.status(400).json({ error: '需要 id' });

  try {
    await db.collection('points').doc(id).delete();
    if (publicId) await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ success: true, message: `已刪除點位 ${id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
