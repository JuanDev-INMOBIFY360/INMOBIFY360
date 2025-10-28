import prisma from "../../config/db.js";

export const getAllPrivileges = async () => {
  return await prisma.privileges.findMany({
    include: {
      permission: {
        include: {
          role: true,
        },
      },
    },
  });
};

export const getPrivilegeById = async (id) => {
  return await prisma.privileges.findUnique({
    where: { id },
    include: {
      permission: {
        include: {
          role: true,
        },
      },
    },
  });
};

export const createPrivilege = async (data) => {
  return await prisma.privileges.create({
    data,
    include: {
      permission: {
        include: {
          role: true,
        },
      },
    },
  });
};

export const updatePrivilege = async (id, data) => {
  return await prisma.privileges.update({
    where: { id },
    data,
    include: {
      permission: {
        include: {
          role: true,
        },
      },
    },
  });
};

export const deletePrivilege = async (id) => {
  return await prisma.privileges.delete({
    where: { id },
  });
};
