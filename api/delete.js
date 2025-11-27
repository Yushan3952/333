// backend/api/delete.js
import { db } from "../../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "POST only" });

  const { password, id } = req.body;

  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(403).json({ success: false, message: "wrong password" });

  if (!id)
    return res.status(400).json({ success: false, message: "missing id" });

  try {
    await deleteDoc(doc(db, "points", id));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
