import {
  getProperties,
  countProperties,
  getPropertyById,
  deleteProperty,
  addImagesToProperty,
  deletePropertyImage,
  getImageById,
  setPrimaryImage,
  getPropertyImages,
  createProperty,
} from './property.repository.js';
import { uploadImage, deleteImage, deleteImages } from '../../config/cloudinary.js';
import { getPagination } from '../../utils/pagination.js';
import { generatePropertyCode } from '../../utils/propertyCode.js';
/**
 * Obtener todas las propiedades con paginación
 */
export const fetchProperties = async (query) => {
  const { skip, take, page, limit } = getPagination(query);
  
  // Extraer filtros del query
  const filters = {
    operacion: query.operacion,
    estado: query.estado,
    ciudad: query.ciudad,
    minPrecio: query.minPrecio,
    maxPrecio: query.maxPrecio,
    habitaciones: query.habitaciones,
    banos: query.banos,
    typePropertyId: query.typePropertyId,
    publicada: query.publicada,
    destacada: query.destacada,
  };

  const [properties, total] = await Promise.all([
    getProperties({ skip, take, filters }),
    countProperties(filters),
  ]);

  return {
    data: properties,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
};

/**
 * Obtener una propiedad por ID
 */
export const fetchPropertyById = async (id) => {
  const property = await getPropertyById(id);
  if (!property) {
    throw new Error('Propiedad no encontrada');
  }
  return property;
};

/**
 * Crear una nueva propiedad
 */
export const addProperty = async (data) => {
  let uploadedImages = [];

  if (data.images?.length) {
    uploadedImages = await Promise.all(
      data.images.map(async (img, index) => {
        const { url, publicId } = await uploadImage(img.base64, 'properties');
        return {
          url,
          publicId,
          isPrimary: img.isPrimary || index === 0,
          order: img.order ?? index,
        };
      })
    );
  }

  try {
    return await createProperty({
      ...data,
      images: uploadedImages,
    });
  } catch (error) {
    if (uploadedImages.length) {
      await deleteImages(uploadedImages.map((i) => i.publicId));
    }
    throw error;
  }
};

/**
 * Actualizar una propiedad
 */
export const modifyProperty = async (id, data) => {
  const { commonAreaIds, codigo, ...propertyData } = data;

  const existingProperty = await getPropertyById(id);
  if (!existingProperty) {
    throw new Error('Propiedad no encontrada');
  }

  // ❌ NO permitir cambiar código
  if (codigo && codigo !== existingProperty.codigo) {
    throw new Error('El código de la propiedad no se puede modificar');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedProperty = await tx.property.update({
      where: { id },
      data: propertyData,
    });

    // 🔄 Sincronizar zonas comunes
    if (Array.isArray(commonAreaIds)) {
      await tx.propertyCommonArea.deleteMany({
        where: { propertyId: id },
      });

      if (commonAreaIds.length > 0) {
        await tx.propertyCommonArea.createMany({
          data: commonAreaIds.map((areaId) => ({
            propertyId: id,
            commonAreaId: areaId,
          })),
        });
      }
    }

    return updatedProperty;
  });
};

/**
 * Eliminar una propiedad
 */
export const removeProperty = async (id) => {
  const property = await getPropertyById(id);
  if (!property) {
    throw new Error('Propiedad no encontrada');
  }

  // Eliminar imágenes de Cloudinary
  if (property.images && property.images.length > 0) {
    const publicIds = property.images.map((img) => img.publicId);
    await deleteImages(publicIds).catch(console.error);
  }

  return await deleteProperty(id);
};

/**
 * Subir imágenes a una propiedad existente
 */
export const uploadPropertyImages = async (propertyId, images) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new Error('Propiedad no encontrada');
  }

  const currentImagesCount = property.images?.length || 0;
  const newImagesCount = images.length;

  if (currentImagesCount + newImagesCount > 20) {
    throw new Error(
      `No puedes agregar ${newImagesCount} imágenes. Límite: 20 imágenes por propiedad (actualmente tienes ${currentImagesCount})`
    );
  }

  // Validar que solo haya una imagen primaria en las nuevas imágenes
  const primaryImages = images.filter((img) => img.isPrimary);
  if (primaryImages.length > 1) {
    throw new Error('Solo puede haber una imagen primaria');
  }

  // Si se marca una nueva imagen como primaria, actualizar las existentes
  if (primaryImages.length === 1) {
    await setPrimaryImage(propertyId, -1); // Remover primaria de todas (se actualizará después)
  }

  // Subir todas las imágenes a Cloudinary
  const uploadedImages = await Promise.all(
    images.map(async (img, index) => {
      const { url, publicId } = await uploadImage(img.base64, 'properties');
      return {
        url,
        publicId,
        isPrimary: img.isPrimary || false,
        order: img.order !== undefined ? img.order : currentImagesCount + index,
      };
    })
  );

  try {
    await addImagesToProperty(propertyId, uploadedImages);
    return await getPropertyImages(propertyId);
  } catch (error) {
    // Si falla, eliminar las imágenes subidas
    const publicIds = uploadedImages.map((img) => img.publicId);
    await deleteImages(publicIds).catch(console.error);
    throw error;
  }
};

/**
 * Eliminar una imagen de una propiedad
 */
export const removePropertyImage = async (propertyId, imageId) => {
  const image = await getImageById(imageId);
  if (!image) {
    throw new Error('Imagen no encontrada');
  }

  if (image.propertyId !== propertyId) {
    throw new Error('La imagen no pertenece a esta propiedad');
  }

  // Eliminar de Cloudinary
  await deleteImage(image.publicId).catch(console.error);

  // Eliminar de la base de datos
  await deletePropertyImage(imageId);

  // Si era la imagen primaria, establecer otra como primaria
  if (image.isPrimary) {
    const remainingImages = await getPropertyImages(propertyId);
    if (remainingImages.length > 0) {
      await setPrimaryImage(propertyId, remainingImages[0].id);
    }
  }

  return { message: 'Imagen eliminada correctamente' };
};

/**
 * Establecer una imagen como primaria
 */
export const setPropertyPrimaryImage = async (propertyId, imageId) => {
  const image = await getImageById(imageId);
  if (!image) {
    throw new Error('Imagen no encontrada');
  }

  if (image.propertyId !== propertyId) {
    throw new Error('La imagen no pertenece a esta propiedad');
  }

  await setPrimaryImage(propertyId, imageId);
  return { message: 'Imagen primaria actualizada correctamente' };
};