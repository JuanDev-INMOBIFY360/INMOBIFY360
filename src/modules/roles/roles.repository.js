import prisma from '../../config/db.js';

export const getAllRoles = async () => {
  return await prisma.roles.findMany({
    include: {
      users: true,
      rolePermissions: {
        include: {
          permission: {
            include: {
              privileges: true,
            },
          },
        },
      },
    },
  });
};

export const getRoleById = async (id) => {
  return await prisma.roles.findUnique({
    where: { id: id },
    include: {
      permissions: {
        include: { privileges: true },
      },
    },
  });
};

export const createRoleWithPermissions = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Crear rol
    const role = await tx.roles.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // 2️⃣ Asignar permisos y privilegios
    for (const p of data.permissions) {
      // Validar permiso existe
      const permissionExists = await tx.permissions.findUnique({
        where: { id: p.permissionId },
      });

      if (!permissionExists) {
        throw new Error(`Permission ${p.permissionId} no existe`);
      }

      // Crear relación rol-permiso
      const rolePermission = await tx.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: p.permissionId,
        },
      });

      // Validar privilegios
      const validPrivileges = await tx.privileges.findMany({
        where: {
          id: { in: p.privileges },
          permissionId: p.permissionId,
        },
      });

      if (validPrivileges.length !== p.privileges.length) {
        throw new Error(
          `Privilegios inválidos para permission ${p.permissionId}`
        );
      }

      // Crear relación rol-permiso-privilegios
      await tx.rolePermissionPrivilege.createMany({
        data: p.privileges.map((privilegeId) => ({
          rolePermissionId: rolePermission.id,
          privilegeId,
        })),
      });
    }

    return role;
  });
};


export const updateRole = async (id, data) => {
  return await prisma.roles.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};


export const deleteRole = async (id) => {
  return await prisma.roles.delete({
    where: { id: id },
  });
};
