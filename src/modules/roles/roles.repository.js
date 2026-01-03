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
    where: { id },
    include: {
      rolePermissions: {
        include: {
          privileges: {
            include: {
              privilege: true, 
            },
          },
        },
      },
    },
  });
};


export const createRoleWithPrivileges = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Crear rol
    const role = await tx.roles.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // 2️⃣ Obtener privilegios válidos con su permiso
    const privileges = await tx.privileges.findMany({
      where: { id: { in: data.privileges } },
      select: { id: true, permissionId: true },
    });

    if (privileges.length !== data.privileges.length) {
      throw new Error('Privilegios inválidos');
    }

    // 3️⃣ Agrupar por permissionId
    const byPermission = {};
    for (const priv of privileges) {
      if (!byPermission[priv.permissionId]) {
        byPermission[priv.permissionId] = [];
      }
      byPermission[priv.permissionId].push(priv.id);
    }

    // 4️⃣ Crear relaciones
    for (const [permissionId, privilegeIds] of Object.entries(byPermission)) {
      const rolePermission = await tx.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: Number(permissionId),
        },
      });

      await tx.rolePermissionPrivilege.createMany({
        data: privilegeIds.map((privilegeId) => ({
          rolePermissionId: rolePermission.id,
          privilegeId,
        })),
      });
    }

    return role;
  });
};

export const updateRoleWithPrivileges = async (roleId, data) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Actualizar datos básicos
    const role = await tx.roles.update({
      where: { id: roleId },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // 2️⃣ Eliminar relaciones anteriores
    await tx.rolePermissionPrivilege.deleteMany({
      where: {
        rolePermission: {
          roleId,
        },
      },
    });

    await tx.rolePermission.deleteMany({
      where: { roleId },
    });

    // 3️⃣ Obtener privilegios válidos
    const privileges = await tx.privileges.findMany({
      where: { id: { in: data.privileges } },
      select: { id: true, permissionId: true },
    });

    if (privileges.length !== data.privileges.length) {
      throw new Error('Privilegios inválidos');
    }

    // 4️⃣ Agrupar por permissionId
    const byPermission = {};
    for (const priv of privileges) {
      if (!byPermission[priv.permissionId]) {
        byPermission[priv.permissionId] = [];
      }
      byPermission[priv.permissionId].push(priv.id);
    }

    // 5️⃣ Recrear relaciones
    for (const [permissionId, privilegeIds] of Object.entries(byPermission)) {
      const rolePermission = await tx.rolePermission.create({
        data: {
          roleId,
          permissionId: Number(permissionId),
        },
      });

      await tx.rolePermissionPrivilege.createMany({
        data: privilegeIds.map((privilegeId) => ({
          rolePermissionId: rolePermission.id,
          privilegeId,
        })),
      });
    }

    return role;
  });
};

export const deleteRole = async (id) => {
  return await prisma.roles.delete({
    where: { id: id },
  });
};
