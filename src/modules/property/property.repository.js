import prisma from '../../config/db.js';

/**
 * Obtener todas las propiedades con paginación y filtros
 */
export const getProperties = async ({ skip, take, filters = {} }) => {
  const where = {};

  // Aplicar filtros
  if (filters.operacion) where.operacion = filters.operacion;
  if (filters.estado) where.estado = filters.estado;
  if (filters.ciudad) where.ciudad = { contains: filters.ciudad };
  if (filters.minPrecio || filters.maxPrecio) {
    where.precio = {};
    if (filters.minPrecio) where.precio.gte = parseFloat(filters.minPrecio);
    if (filters.maxPrecio) where.precio.lte = parseFloat(filters.maxPrecio);
  }
  if (filters.habitaciones) where.habitaciones = parseInt(filters.habitaciones);
  if (filters.banos) where.banos = parseInt(filters.banos);
  if (filters.typePropertyId) where.typePropertyId = parseInt(filters.typePropertyId);
  if (filters.publicada !== undefined) where.publicada = filters.publicada === 'true';
  if (filters.destacada !== undefined) where.destacada = filters.destacada === 'true';

  return await prisma.property.findMany({
    where,
    skip,
    take,
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      typeProperty: true,
      country: true,
      department: true,

      // ✅ ZONAS COMUNES
      commonAreas: {
        include: {
          commonArea: true,
        },
      },

      
      properties:{
        include: {
          nearbyPlace: true,
        },
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Contar propiedades con filtros
 */
export const countProperties = async (filters = {}) => {
  const where = {};

  if (filters.operacion) where.operacion = filters.operacion;
  if (filters.estado) where.estado = filters.estado;
  if (filters.ciudad) where.ciudad = { contains: filters.ciudad };
  if (filters.minPrecio || filters.maxPrecio) {
    where.precio = {};
    if (filters.minPrecio) where.precio.gte = parseFloat(filters.minPrecio);
    if (filters.maxPrecio) where.precio.lte = parseFloat(filters.maxPrecio);
  }
  if (filters.habitaciones) where.habitaciones = parseInt(filters.habitaciones);
  if (filters.banos) where.banos = parseInt(filters.banos);
  if (filters.typePropertyId) where.typePropertyId = parseInt(filters.typePropertyId);
  if (filters.publicada !== undefined) where.publicada = filters.publicada === 'true';
  if (filters.destacada !== undefined) where.destacada = filters.destacada === 'true';

  return await prisma.property.count({ where });
};

/**
 * Obtener una propiedad por ID
 */
export const getPropertyById = async (id) => {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
      },
      owner: true,
      typeProperty: true,
      country: true,
      department: true,

      // ✅ ZONAS COMUNES
      commonAreas: {
        include: {
          commonArea: true,
        },
      },

      // ✅ LUGARES CERCANOS
     properties:{
        include: {
          nearbyPlace: true,
        },
      },
    },
  });
};

/**
 * Crear una propiedad
 */
export const createProperty = async (data) => {
  const {
    images = [],
    commonAreaIds = [],
    nearbyPlaces = [],
    ...propertyData
  } = data;

  return await prisma.$transaction(async (tx) => {
    const property = await tx.property.create({
      data: {
        ...propertyData,

        images: images.length
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                publicId: img.publicId,
                isPrimary: img.isPrimary || index === 0,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
    });

    // ✅ ZONAS COMUNES
    if (commonAreaIds.length > 0) {
      await tx.propertyCommonArea.createMany({
        data: commonAreaIds.map((id) => ({
          propertyId: property.id,
          commonAreaId: id,
        })),
      });
    }

    // ✅ LUGARES CERCANOS
    if (nearbyPlaces.length > 0) {
      await tx.propertyNearbyPlace.createMany({
        data: nearbyPlaces.map((np) => ({
          propertyId: property.id,
          nearbyPlaceId: np.nearbyPlaceId,
          distance: np.distance,
        })),
      });
    }

    return property;
  });
};

/**
 * Actualizar una propiedad
 */
export const updateProperty = async (id, data) => {
  return await prisma.property.update({
    where: { id },
    data,
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
      },
      owner: true,
      typeProperty: true,
      country: true,
      department: true,
      properties:{
        include: {
          nearbyPlace: true,
        },
      },
      // ✅ ZONAS COMUNES

      commonAreas: {
        include: {
          commonArea: true,
        },
      },
    },
  });
};

/**
 * Eliminar una propiedad
 */
export const deleteProperty = async (id) => {
  return await prisma.property.delete({
    where: { id },
    include: {
      images: true,
    },
  });
};

/**
 * Agregar imágenes a una propiedad
 */
export const addImagesToProperty = async (propertyId, images) => {
  const existingImagesCount = await prisma.propertyImage.count({
    where: { propertyId },
  });

  return await prisma.propertyImage.createMany({
    data: images.map((img, index) => ({
      propertyId,
      url: img.url,
      publicId: img.publicId,
      isPrimary:
        existingImagesCount === 0 && index === 0
          ? true
          : img.isPrimary || false,
      order:
        img.order !== undefined
          ? img.order
          : existingImagesCount + index,
    })),
  });
};

/**
 * Eliminar una imagen
 */
export const deletePropertyImage = async (imageId) => {
  return await prisma.propertyImage.delete({
    where: { id: imageId },
  });
};

/**
 * Obtener una imagen por ID
 */
export const getImageById = async (imageId) => {
  return await prisma.propertyImage.findUnique({
    where: { id: imageId },
  });
};

/**
 * Establecer una imagen como primaria
 */
export const setPrimaryImage = async (propertyId, imageId) => {
  return await prisma.$transaction(async (tx) => {
    await tx.propertyImage.updateMany({
      where: { propertyId },
      data: { isPrimary: false },
    });

    return await tx.propertyImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  });
};

/**
 * Obtener imágenes de una propiedad
 */
export const getPropertyImages = async (propertyId) => {
  return await prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
  });
};

/**
 * Verificar si existe una propiedad por código
 */
export const existsByCode = async (codigo, excludeId = null) => {
  const where = { codigo };
  if (excludeId) {
    where.id = { not: excludeId };
  }

  const count = await prisma.property.count({ where });
  return count > 0;
};
