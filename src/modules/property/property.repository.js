import prisma from '../../config/db.js';

export const getProperties = async () => {
  return await prisma.property.findMany({
    include: {
      owner: true,
      country: true,
      city: true,
      neighborhood: true,
      typeProperty: true,
    },
  });
};

export const getPropertyById = async (id) => {
  return await prisma.property.findUnique({
    where: { id: Number(id) },
    include: {
      owner: true,
      country: true,
      city: true,
      neighborhood: true,
      typeProperty: true,
    },
  });
};

export const createProperty = async (data) => {
  // Normalizar campos de relación: si vienen ownerId, countryId, etc. convertir a connect
  const prismaData = { ...data };
  if (prismaData.ownerId !== undefined) {
    prismaData.owner = { connect: { id: Number(prismaData.ownerId) } };
    delete prismaData.ownerId;
  }
  if (prismaData.countryId !== undefined) {
    prismaData.country = { connect: { id: Number(prismaData.countryId) } };
    delete prismaData.countryId;
  }
  if (prismaData.departmentId !== undefined) {
    prismaData.department = { connect: { id: Number(prismaData.departmentId) } };
    delete prismaData.departmentId;
  }
  if (prismaData.cityId !== undefined) {
    prismaData.city = { connect: { id: Number(prismaData.cityId) } };
    delete prismaData.cityId;
  }
  if (prismaData.neighborhoodId !== undefined) {
    prismaData.neighborhood = { connect: { id: Number(prismaData.neighborhoodId) } };
    delete prismaData.neighborhoodId;
  }
  if (prismaData.typePropertyId !== undefined) {
    prismaData.typeProperty = { connect: { id: Number(prismaData.typePropertyId) } };
    delete prismaData.typePropertyId;
  }

  return await prisma.property.create({ data: prismaData });
};

export const updateProperty = async (id, data) => {
  const prismaData = { ...data };
  if (prismaData.ownerId !== undefined) {
    prismaData.owner = { connect: { id: Number(prismaData.ownerId) } };
    delete prismaData.ownerId;
  }
  if (prismaData.countryId !== undefined) {
    prismaData.country = { connect: { id: Number(prismaData.countryId) } };
    delete prismaData.countryId;
  }
  if (prismaData.departmentId !== undefined) {
    prismaData.department = { connect: { id: Number(prismaData.departmentId) } };
    delete prismaData.departmentId;
  }
  if (prismaData.cityId !== undefined) {
    prismaData.city = { connect: { id: Number(prismaData.cityId) } };
    delete prismaData.cityId;
  }
  if (prismaData.neighborhoodId !== undefined) {
    prismaData.neighborhood = { connect: { id: Number(prismaData.neighborhoodId) } };
    delete prismaData.neighborhoodId;
  }
  if (prismaData.typePropertyId !== undefined) {
    prismaData.typeProperty = { connect: { id: Number(prismaData.typePropertyId) } };
    delete prismaData.typePropertyId;
  }

  // Remove client-only or transient fields that are not part of the Prisma model
  const clientOnlyFields = ['primaryImageId', 'uploadedImages', 'deletedImages', 'tempFiles'];
  const stripped = [];
  for (const f of clientOnlyFields) {
    if (prismaData[f] !== undefined) {
      stripped.push(f);
      delete prismaData[f];
    }
  }

  if (stripped.length) {
    console.log('Stripped client-only fields before Prisma update:', stripped.join(', '));
  }

  console.log('Prisma update property data:', JSON.stringify(prismaData));
  return await prisma.property.update({
    where: { id: Number(id) },
    data: prismaData,
  });
};

export const deleteProperty = async (id) => {
  return await prisma.property.delete({
    where: { id: Number(id) },
  });
};
