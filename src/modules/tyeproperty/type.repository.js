import prisma from "../../config/db.js";

export const getTypeProperties = async () => {
  return await prisma.typeProperty.findMany({
    include: {
      properties: true,
    },
  });
};

export const getTypePropertyById = async (id) => {
  return await prisma.typeProperty.findUnique({
    where: { id },
    include: {
      properties: true,
    },
  });
};
export const createTypeProperty = async (data) => {
  return await prisma.typeProperty.create({
    data,
    include: {
      properties: true,
    },
  });
};
export const updateTypeProperty = async (id, data) => {
  return await prisma.typeProperty.update({
    where: { id },
    data,
    include: {
      properties: true,
    },
  });
};
export const deleteTypeProperty = async (id) => {
  return await prisma.typeProperty.delete({
    where: { id },
  });
};
