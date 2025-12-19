import prisma from '../../config/db.js';

export const getTypeProperties = async () => {
  return await prisma.typeProperty.findMany();
};

export const getTypePropertyById = async (id) => {
  return await prisma.typeProperty.findUnique({ where: { id } });
};

export const createTypeProperty = async (data) => {
  return await prisma.typeProperty.create({ data });
};

export const updateTypeProperty = async (id, data) => {
  return await prisma.typeProperty.update({ where: { id }, data });
};

export const deleteTypeProperty = async (id) => {
  return await prisma.typeProperty.delete({ where: { id } });
};
