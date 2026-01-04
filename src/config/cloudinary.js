import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary
 * @param {string} base64Image - Imagen en base64
 * @param {string} folder - Carpeta en Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (base64Image, folder = 'properties') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Error al subir la imagen');
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - Public ID de Cloudinary
 * @returns {Promise<void>}
 */
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Error al eliminar la imagen');
  }
};

/**
 * Elimina múltiples imágenes de Cloudinary
 * @param {string[]} publicIds - Array de Public IDs
 * @returns {Promise<void>}
 */
export const deleteImages = async (publicIds) => {
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw new Error('Error al eliminar las imágenes');
  }
};

export default cloudinary;