import prisma from '../../config/db.js';

export const getOwners = async () => {
  return await prisma.owner.findMany({
    include: {
      properties: true,
    },
  });
};

export const getOwnerById = async (id) => {
  return await prisma.owner.findUnique({
    where: { id },
    include: {
      properties: true,
    },
  });
};

export const createOwner = async (data) => {
  return await prisma.owner.create({
    data,
    include: {
      properties: true,
    },
  });
};

export const updateOwner = async (id, data) => {
  return await prisma.owner.update({
    where: { id },
    data,
    include: {
      properties: true,
    },
  });
};

export const deleteOwner = async (id) => {
  return await prisma.owner.delete({
    where: { id },
  });
};
