// backend/api/delete.j
import { db } from "../../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

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

  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: "缺少 id" });

  try {
    await deleteDoc(doc(db, "points", id));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
