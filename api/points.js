import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const snap = await getDocs(collection(db, "points"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, points: data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
