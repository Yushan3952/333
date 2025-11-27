// backend/api/add.j
import { db } from "../../firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-password");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "POST only" });

  const password = req.headers["x-password"];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: "密碼錯誤" });
  }

  const { lat, lng, note } = req.body;
  if (!lat || !lng) return res.status(400).json({ success: false, message: "座標缺失" });

  try {
    const docRef = await addDoc(collection(db, "points"), {
      lat,
      lng,
      note: note || "",
      createdAt: Timestamp.now()
    });
    res.status(200).json({ success: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

