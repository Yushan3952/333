import db from '../utils/firebase.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: '只支援 GET' });

  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) return res.status(401).json({ error: '密碼錯誤' });

  try {
    const snapshot = await db.collection('points').get();
    const points = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(points);
  } catch (err) {
    console.error('Firebase 取得資料錯誤：', err);
    res.status(500).json({ error: '取得 Firebase 資料失敗' });
  }
}
