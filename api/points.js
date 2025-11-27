// backend/api/points.j
import { db } from "../../firebase.js";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-password");

  if (req.method === "OPTIONS") return res.status(200).end();

  const password = req.headers["x-password"];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: "密碼錯誤" });
  }

  try {
    const snap = await getDocs(collection(db, "points"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, points: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
