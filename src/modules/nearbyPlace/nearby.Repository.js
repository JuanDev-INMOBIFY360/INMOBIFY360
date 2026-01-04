import prisma from '../../config/db.js';


export const getAllNearbyPlaces = async () => {
  return await prisma.nearbyPlace.findMany();
};

export const getNearbyPlaceById = async (id) => {
  return await prisma.nearbyPlace.findUnique({
    where: { id: id },
  });
};
export const createNearbyPlace = async (data) => {
  return await prisma.nearbyPlace.create({
    data: data,
  });
};
export const updateNearbyPlace = async (id, data) => {
  return await prisma.nearbyPlace.update({
    where: { id: id },
    data: data,
  });
};
export const deleteNearbyPlace = async (id) => {
  return await prisma.nearbyPlace.delete({
    where: { id: id },
  });
};