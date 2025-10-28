import prisma from "../../config/db.js";


export const getAllRoles = async () => {
  return await prisma.roles.findMany({
    include: {
      permissions: true,
      users: true,
    },
  });
};

export const getRoleById = async (id) => {
  return await prisma.roles.findUnique({
    where: { id: id },
  });
};

export const createRole = async (data) => {
  return await prisma.roles.create({
    data: data,
  });
}

export const updateRole = async (id, data) => {
  return await prisma.roles.update({
    where: { id: id },
    data: data,
  });
}

export const deleteRole = async (id) => {
  return await prisma.roles.delete({
    where: { id: id },
  });
}