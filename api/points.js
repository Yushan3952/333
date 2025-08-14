import db from '../utils/firebase.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' });
  }

  try {
    const snapshot = await db.collection('points').get();
    const points = [];
    snapshot.forEach(doc => points.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
