import express from 'express';
import cloudinary from 'cloudinary';

const app = express();
app.use(express.json());

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post('/api/delete-image', async (req, res) => {
  try {
    const { publicId } = req.body;
    await cloudinary.v2.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
