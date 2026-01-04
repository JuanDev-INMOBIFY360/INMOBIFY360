import prisma from '../../config/db.js';

export const getAllcommonAreas = async () => {
  return await prisma.commonArea.findMany();
};

export const getcommonAreaById = async (id) => {
  return await prisma.commonArea.findUnique({
    where: { id: id },
  });
};
export const createcommonArea = async (data) => {
  return await prisma.commonArea.create({
    data: data,
  });
};
export const updatecommonArea = async (id, data) => {
  return await prisma.commonArea.update({
    where: { id: id },
    data: data,
  });
};
export const deletecommonArea = async (id) => {
  return await prisma.commonArea.delete({
    where: { id: id },
  });
};