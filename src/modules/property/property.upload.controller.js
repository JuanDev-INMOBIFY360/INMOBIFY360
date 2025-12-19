import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';
import { fetchPropertyById, modifyProperty } from './property.service.js';

// Sube un solo archivo (campo 'image') y lo agrega al array `imagenes` de la propiedad
export const uploadPropertyImageController = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file provided' });

    // subir a cloudinary usando upload_stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `inmobify360/properties/${propertyId}` },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    // Obtener la propiedad actual y agregar la imagen al array
    const property = await fetchPropertyById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const existingImages = property.imagenes || [];

    // Agregar nuevo objeto de imagen (puedes ajustar la estructura)
    const newImage = {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
    const updatedImages = Array.isArray(existingImages)
      ? [...existingImages, newImage]
      : [newImage];

    const updatedProperty = await modifyProperty(propertyId, { imagenes: updatedImages });

    res.status(200).json({ message: 'Image uploaded', image: newImage, property: updatedProperty });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// Añadir metadata de imagen ya subida a Cloudinary al array `imagenes` de la propiedad
export const addImageMetadataController = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { url, public_id, resource_type } = req.body;

    if (!url || !public_id)
      return res.status(400).json({ message: 'url and public_id are required' });

    const property = await fetchPropertyById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const existingImages = property.imagenes || [];
    const newImage = { url, public_id, resource_type };
    const updatedImages = Array.isArray(existingImages)
      ? [...existingImages, newImage]
      : [newImage];

    const updatedProperty = await modifyProperty(propertyId, { imagenes: updatedImages });
    return res.json({
      message: 'Image metadata added',
      image: newImage,
      property: updatedProperty,
    });
  } catch (err) {
    console.error('Error adding image metadata:', err);
    return res.status(500).json({ message: 'Error adding image metadata', error: err.message });
  }
};

// Eliminar imagen: borrar en Cloudinary y sacar del array `imagenes` de la propiedad
export const removeImageController = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: 'public_id required' });

    // destruir en cloudinary
    const destroyRes = await cloudinary.uploader.destroy(public_id);

    // actualizar propiedad
    const property = await fetchPropertyById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const existingImages = property.imagenes || [];
    const updatedImages = existingImages.filter((img) => img.public_id !== public_id);

    const updatedProperty = await modifyProperty(propertyId, { imagenes: updatedImages });

    return res.json({ message: 'Image removed', destroyRes, property: updatedProperty });
  } catch (err) {
    console.error('Error removing image:', err);
    return res.status(500).json({ message: 'Error removing image', error: err.message });
  }
};
