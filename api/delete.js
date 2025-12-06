import { db } from "../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ success: false });

  try {
    await deleteDoc(doc(db, "points", id));
    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
