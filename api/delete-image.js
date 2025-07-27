import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { publicId } = req.body;
    try {
      await cloudinary.uploader.destroy(publicId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: '刪除失敗', detail: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
