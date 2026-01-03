import prisma from "../../config/db.js";

/**
 * Obtener todos los privilegios
 * Incluye el permiso al que pertenece cada privilegio
 */
export const getAllPrivileges = async () => {
  return await prisma.privileges.findMany({
    include: {
      permission: true, // ✅ relación válida
    },
    orderBy: {
      id: "asc",
    },
  });
};


export const getPrivilegeById = async (id) => {
  return await prisma.privileges.findUnique({
    where: { id },
    include: {
      permission: true,
    },
  });
};


export const createPrivilege = async (data) => {
  return await prisma.privileges.create({
    data: {
      action: data.action,
      displayName: data.displayName,
      description: data.description,
      permissionId: data.permissionId,
    },
    include: {
      permission: true,
    },
  });
};


export const updatePrivilege = async (id, data) => {
  return await prisma.privileges.update({
    where: { id },
    data: {
      action: data.action,
      displayName: data.displayName,
      description: data.description,
      permissionId: data.permissionId,
    },
    include: {
      permission: true,
    },
  });
};


export const deletePrivilege = async (id) => {
  return await prisma.privileges.delete({
    where: { id },
  });
};
