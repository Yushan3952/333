const express = require('express');
const db = require('../utils/firebase');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pointsCollection = db.collection('points');

// 驗證密碼 middleware
function checkPassword(req, res, next) {
  const password = req.headers['x-password'];
  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ error: '密碼錯誤' });
  }
  next();
}

// 列出所有點位
app.get('/points', checkPassword, async (req, res) => {
  try {
    const snapshot = await pointsCollection.get();
    const points = [];
    snapshot.forEach(doc => points.push({ id: doc.id, ...doc.data() }));
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
