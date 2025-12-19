import prisma from '../../config/db.js';

export const getAllPermissions = async () => {
  return await prisma.permissions.findMany({
    include: {
      privileges: true,
    },
  });
};

export const getPermissionById = async (id) => {
  return await prisma.permissions.findUnique({
    where: { id: id },
  });
};
export const createPermission = async (data) => {
  return await prisma.permissions.create({
    data: data,
  });
};
export const updatePermission = async (id, data) => {
  return await prisma.permissions.update({
    where: { id: id },
    data: data,
  });
};
export const deletePermission = async (id) => {
  return await prisma.permissions.delete({
    where: { id: id },
  });
};
