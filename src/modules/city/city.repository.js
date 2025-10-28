import prisma from "../../config/db.js";

export const getCities = async () => {
  return await prisma.city.findMany({
    include: {
      department: {
        include: {
          country: true, 
        },
      },
      neighborhoods: true,
      properties: true,
    },
  });
};

export const getCityById = async (id) => {
  return await prisma.city.findUnique({
    where: { id },
    include: {
      department: {
        include: {
          country: true, 
        },
      },
      neighborhoods: true,
      properties: true,
    },
  });
};

export const createCity = async (data) => {
  return await prisma.city.create({
    data,
  });
};

export const updateCity = async (id, data) => {
  return await prisma.city.update({
    where: { id: id },
    data,
  });
};

export const deleteCity = async (id) => {
  return await prisma.city.delete({
    where: { id: id },
  });
};
