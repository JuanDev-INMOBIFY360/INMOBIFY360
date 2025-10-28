import prisma from "../../config/db.js";

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
  return await prisma.property.create({ data });
};

export const updateProperty = async (id, data) => {
  return await prisma.property.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteProperty = async (id) => {
  return await prisma.property.delete({
    where: { id: Number(id) },
  });
};
