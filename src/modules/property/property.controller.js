import {
  fetchProperties,
  fetchPropertyById,
  addProperty,
  modifyProperty,
  removeProperty,
  uploadPropertyImages,
  removePropertyImage,
  setPropertyPrimaryImage,
} from './property.service.js';
import { validationResult } from 'express-validator';

/**
 * Obtener todas las propiedades
 */
export const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await fetchProperties(req.query);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener una propiedad por ID
 */
export const getPropertyByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Detectar si es ruta pública (/public/:id) o protegida (/:id)
    const isPublic = req.baseUrl.includes('/public');
    const property = await fetchPropertyById(id, isPublic);
    res.status(200).json(property);
  } catch (error) {
    if (error.message === 'Propiedad no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crear una nueva propiedad
 */
export const createPropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProperty = await addProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    if (
      error.message === 'Máximo 20 imágenes permitidas' ||
      error.message === 'Solo puede haber una imagen primaria'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualizar una propiedad
 */
export const updatePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const updatedProperty = await modifyProperty(id, req.body);
    res.status(200).json(updatedProperty);
  } catch (error) {
    if (
      error.message === 'Máximo 20 imágenes permitidas' ||
      error.message === 'Solo puede haber una imagen primaria'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar una propiedad
 */
export const deletePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    await removeProperty(id);
    res.status(200).json({ message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Propiedad no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Subir imágenes a una propiedad
 */
export const uploadImagesController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: 'ID de propiedad inválido' });
    }

    const { images } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Debes proporcionar al menos una imagen' });
    }

    const updatedImages = await uploadPropertyImages(propertyId, images);
    res.status(200).json({
      message: 'Imágenes subidas correctamente',
      images: updatedImages,
    });
  } catch (error) {
    if (
      error.message === 'Propiedad no encontrada' ||
      error.message.includes('No puedes agregar') ||
      error.message === 'Solo puede haber una imagen primaria'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar una imagen de una propiedad
 */
export const deleteImageController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const propertyId = parseInt(req.params.propertyId);
    const imageId = parseInt(req.params.imageId);

    if (isNaN(propertyId) || isNaN(imageId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const result = await removePropertyImage(propertyId, imageId);
    res.status(200).json(result);
  } catch (error) {
    if (
      error.message === 'Imagen no encontrada' ||
      error.message === 'La imagen no pertenece a esta propiedad'
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Establecer una imagen como primaria
 */
export const setPrimaryImageController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const propertyId = parseInt(req.params.propertyId);
    const imageId = parseInt(req.params.imageId);

    if (isNaN(propertyId) || isNaN(imageId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const result = await setPropertyPrimaryImage(propertyId, imageId);
    res.status(200).json(result);
  } catch (error) {
    if (
      error.message === 'Imagen no encontrada' ||
      error.message === 'La imagen no pertenece a esta propiedad'
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
