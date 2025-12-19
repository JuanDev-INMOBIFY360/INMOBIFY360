import {
  fetchAllProperties,
  fetchPropertyById,
  addProperty,
  modifyProperty,
  removeProperty,
} from './property.service.js';
import { validationResult } from 'express-validator';
import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await fetchAllProperties();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const property = await fetchPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = { ...req.body };

    // Eliminar campos cliente-only/transitorios ANTES de procesar
    const clientOnlyFields = ['primaryImageId', 'uploadedImages', 'deletedImages', 'tempFiles'];
    const stripped = [];
    clientOnlyFields.forEach((field) => {
      if (data[field] !== undefined) {
        stripped.push(field);
        delete data[field];
      }
    });
    if (stripped.length) {
      console.log('createPropertyController - Stripped client-only fields:', stripped.join(', '));
    }

    // Convertir campos numéricos de string a número
    const numericFields = [
      'precio',
      'area',
      'areaPrivada',
      'habitaciones',
      'banos',
      'parqueaderos',
      'estrato',
      'piso',
      'antiguedad',
      'administracion',
    ];
    numericFields.forEach((field) => {
      if (data[field]) data[field] = parseFloat(data[field]) || null;
    });

    // Si vienen archivos (multer) en req.files (campo 'imagenes') subirlos a Cloudinary
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer, 'inmobify360/properties'))
      );
      const images = uploads.map((u) => ({
        url: u.secure_url,
        public_id: u.public_id,
        resource_type: u.resource_type,
      }));
      data.imagenes = images;
    }

    const newProperty = await addProperty(data);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const data = { ...req.body };

    // Eliminar campos cliente-only/transitorios ANTES de procesar
    const clientOnlyFields = ['primaryImageId', 'uploadedImages', 'deletedImages', 'tempFiles'];
    const stripped = [];
    clientOnlyFields.forEach((field) => {
      if (data[field] !== undefined) {
        stripped.push(field);
        delete data[field];
      }
    });
    if (stripped.length) {
      console.log('updatePropertyController - Stripped client-only fields:', stripped.join(', '));
    }

    // Convertir campos numéricos de string a número
    const numericFields = [
      'precio',
      'area',
      'areaPrivada',
      'habitaciones',
      'banos',
      'parqueaderos',
      'estrato',
      'piso',
      'antiguedad',
      'administracion',
    ];
    numericFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '')
        data[field] = parseFloat(data[field]) || null;
    });

    // Convertir campos ID que deben ser enteros
    const intIdFields = [
      'ownerId',
      'countryId',
      'departmentId',
      'cityId',
      'neighborhoodId',
      'typePropertyId',
    ];
    intIdFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        const n = Number(data[field]);
        if (!Number.isNaN(n)) data[field] = n;
        else delete data[field];
      }
    });

    // Normalizar imagenes: si viene como objeto vacío, eliminar para no pasar {} a Prisma
    if (
      data.imagenes &&
      typeof data.imagenes === 'object' &&
      !Array.isArray(data.imagenes) &&
      Object.keys(data.imagenes).length === 0
    ) {
      delete data.imagenes;
    }

    // Transformar campos "Id" a conectores de relaciones para Prisma (update/create)
    if (data.ownerId !== undefined && data.ownerId !== null) {
      data.owner = { connect: { id: data.ownerId } };
      delete data.ownerId;
    }
    if (data.countryId !== undefined && data.countryId !== null) {
      data.country = { connect: { id: data.countryId } };
      delete data.countryId;
    }
    if (data.departmentId !== undefined && data.departmentId !== null) {
      data.department = { connect: { id: data.departmentId } };
      delete data.departmentId;
    }
    if (data.cityId !== undefined && data.cityId !== null) {
      data.city = { connect: { id: data.cityId } };
      delete data.cityId;
    }
    if (data.neighborhoodId !== undefined && data.neighborhoodId !== null) {
      data.neighborhood = { connect: { id: data.neighborhoodId } };
      delete data.neighborhoodId;
    }
    if (data.typePropertyId !== undefined && data.typePropertyId !== null) {
      data.typeProperty = { connect: { id: data.typePropertyId } };
      delete data.typePropertyId;
    }

    // Si vienen nuevas imágenes, subirlas y agregarlas al array existente
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(file.buffer, `inmobify360/properties/${req.params.id}`)
        )
      );
      const images = uploads.map((u) => ({
        url: u.secure_url,
        public_id: u.public_id,
        resource_type: u.resource_type,
      }));

      // obtener existentes
      const property = await fetchPropertyById(req.params.id);
      const existing = property?.imagenes || [];
      data.imagenes = Array.isArray(existing) ? [...existing, ...images] : images;
    }

    // Log para depuración: mostrar el objeto que vamos a enviar al servicio
    try {
      console.log('updatePropertyController - data before modifyProperty:', JSON.stringify(data));
    } catch (e) {
      console.log('updatePropertyController - data (non-serializable)');
    }

    const updatedProperty = await modifyProperty(req.params.id, data);
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await removeProperty(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
