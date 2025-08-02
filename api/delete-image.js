import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只接受 POST 請求" });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "缺少 public_id" });
  }

  cloudinary.config({
    cloud_name: "dwhn02tn5",
    api_key: "563586351398427",
    api_secret: "y4T3bAvW6PSdfM2xC8cES0J_J6E",
  });

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary 刪除失敗");
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "圖片刪除失敗" });
  }
}
