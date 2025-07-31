// api/delete-image.js

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dwhn02tn5",
  api_key: "1149371611626611",
  api_secret: "HpMRkWs8c7wYPDuvQtxT2pmJ4vo",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "僅支援 POST 方法" });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "缺少 public_id" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary 刪除失敗: " + result.result);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "伺服器錯誤" });
  }
}
