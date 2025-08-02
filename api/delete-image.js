// /api/delete-image.js

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dwhn02tn5",
  api_key: "899978884379254",
  api_secret: "N4OYQ4knD1T8FejxI7S0kACfXOU",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "缺少 public_id" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") throw new Error("Cloudinary 刪除失敗");

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "圖片刪除失敗" });
  }
}
