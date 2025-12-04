import crypto from 'crypto';
import dotenv from 'dotenv';
import cloudinary from '../../config/cloudinary.js';

dotenv.config();

export const getSignature = (req, res) => {
  try {
    // Protege con authMiddleware cuando registres la ruta
    const timestamp = Math.floor(Date.now() / 1000);
    // Puedes añadir otros params a firmar si los necesitas (folder, eager, etc.)
    const toSign = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return res.json({
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error('Error generating signature:', err);
    return res.status(500).json({ message: 'Error generating signature', error: err.message });
  }
};

export const destroyImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: 'public_id required' });

    const result = await cloudinary.uploader.destroy(public_id);
    return res.json({ message: 'Image destroyed', result });
  } catch (err) {
    console.error('Error destroying image:', err);
    return res.status(500).json({ message: 'Error destroying image', error: err.message });
  }
};
