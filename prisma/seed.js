import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';



const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');


   // ======================================================
  // ROLES
  // ======================================================
  const adminRole = await prisma.roles.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: { name: 'Administrador' },
  });

  await prisma.roles.upsert({
    where: { name: 'Usuario' },
    update: {},
    create: { name: 'Usuario' },
  });

  // ======================================================
  // PERMISSIONS (CATÁLOGO GLOBAL)
  // ======================================================
  const modules = [
    'property',
    'user',
    'owner',
    'role',
    'country',
    'city',
    'department',
    'neighborhood',
    'typeProperty',
    'permissions',
    'privileges',
    'auth',
  ];

  const permissionsMap = {};

  for (const module of modules) {
    permissionsMap[module] = await prisma.permissions.upsert({
      where: { name: module },
      update: {},
      create: {
        name: module,
        displayName: module.charAt(0).toUpperCase() + module.slice(1),
      },
    });
  }

  // ======================================================
  // PRIVILEGES (CATÁLOGO GLOBAL POR PERMISO)
  // ======================================================
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'CHANGE_STATE'];

  const actionLabelMap = {
    CREATE: 'Crear',
    READ: 'Ver',
    UPDATE: 'Editar',
    DELETE: 'Eliminar',
    CHANGE_STATE: 'Cambiar estado',
  };

  for (const permission of Object.values(permissionsMap)) {
    for (const action of actions) {
      await prisma.privileges.upsert({
        where: {
          action_permissionId: {
            action,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          action,
          displayName: actionLabelMap[action],
          permissionId: permission.id,
        },
      });
    }
  }

  // ======================================================
  // ASIGNAR TODOS LOS PERMISOS AL ROL ADMIN
  // ======================================================
  for (const permission of Object.values(permissionsMap)) {
    const rolePermission = await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });

    const privileges = await prisma.privileges.findMany({
      where: { permissionId: permission.id },
    });

    for (const privilege of privileges) {
      await prisma.rolePermissionPrivilege.upsert({
        where: {
          rolePermissionId_privilegeId: {
            rolePermissionId: rolePermission.id,
            privilegeId: privilege.id,
          },
        },
        update: {},
        create: {
          rolePermissionId: rolePermission.id,
          privilegeId: privilege.id,
        },
      });
    }
  }

  // ======================================================
  // USUARIO ADMIN
  // ======================================================
  if (!process.env.USER_ADMIN || !process.env.USER_ADMIN_PASSWORD) {
    throw new Error('❌ USER_ADMIN o USER_ADMIN_PASSWORD no definidos');
  }

  const saltRounds = Number(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10;
  const password = await bcrypt.hash(process.env.USER_ADMIN_PASSWORD, saltRounds);

  await prisma.user.upsert({
    where: { email: process.env.USER_ADMIN },
    update: {
      password,
      roleId: adminRole.id,
    },
    create: {
      email: process.env.USER_ADMIN,
      password,
      name: 'Admin',
      roleId: adminRole.id,
    },
  });


  
  console.log('✅ Seed RBAC ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
