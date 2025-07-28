import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { publicId } = req.body;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: '刪除失敗', details: err });
  }
}
