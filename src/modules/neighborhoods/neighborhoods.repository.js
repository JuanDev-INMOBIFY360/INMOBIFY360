import prisma from "../../config/db.js";

export const getNeighborhoods = async () => {
  return await prisma.neighborhood.findMany({
    include: {country: true, city: true, departament: true },
  });
}

export const getNeighborhoodById = async (id) => {
  return await prisma.neighborhood.findUnique({
    where: { id: id },
    include: {country: true, city: true, departament: true },
  });
}

export const createNeighborhood = async (data) => {
  return await prisma.neighborhood.create({
    data: data,
  });
}
export const updateNeighborhood = async (id, data) => {
  return await prisma.neighborhood.update({
    where: { id: id },
    data: data,
  });
}
export const deleteNeighborhood = async (id) => {
  return await prisma.neighborhood.delete({
    where: { id: id },
  });
}