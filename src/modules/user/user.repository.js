import prisma from "../../config/db.js";

export const getUsers = async () => {
  return await prisma.user.findMany({
    include: { role: true },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { role: true },
  });
};

export const createUser = async (data) => {
  return await prisma.user.create({ data });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
};
