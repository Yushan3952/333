// backend/api/add.js
import { db } from "../../firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "POST only" });

  const { password, lat, lng, image, note } = req.body;

  if (password !== process.env.ADMIN_PASSWORD)
    return res.status(403).json({ success: false, message: "wrong password" });

  if (!lat || !lng)
    return res.status(400).json({ success: false, message: "missing coordinates" });

  try {
    const docRef = await addDoc(collection(db, "points"), {
      lat,
      lng,
      image: image || null,
      note: note || "",
      createdAt: Timestamp.now()
    });

    res.status(200).json({ success: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
