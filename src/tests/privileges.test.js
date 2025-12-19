import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

let permission;

beforeAll(async () => {
  // Busca un permiso existente
  permission = await prisma.permissions.findFirst();

  // Si no hay ninguno (por ejemplo, si se ejecuta este test solo)
  if (!permission) {
    const role = await prisma.roles.create({
      data: { name: 'TempRole_' + Date.now() },
    });

    permission = await prisma.permissions.create({
      data: { name: 'TempPermission_' + Date.now(), roleId: role.id },
    });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Privileges CRUD', () => {
  it('Crea o usa un privilegio READ asociado a un permiso existente', async () => {
    const privilege = await prisma.privileges.upsert({
      where: {
        action_permissionId: {
          action: 'READ',
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        action: 'READ',
        permissionId: permission.id,
      },
    });

    expect(privilege.action).toBe('READ');
    expect(privilege.permissionId).toBe(permission.id);
  });
});
