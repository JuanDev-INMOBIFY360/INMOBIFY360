import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Permissions CRUD', () => {
  let role, permission;

  beforeAll(async () => {
    role = await prisma.roles.create({
      data: { name: 'Tester_' + Date.now() }, // único
    });
  });

  it('Crea un permiso asociado a un rol', async () => {
    permission = await prisma.permissions.create({
      data: { name: 'ManageUsers_' + Date.now(), roleId: role.id },
    });
    expect(permission.name).toContain('ManageUsers_');
    expect(permission.roleId).toBe(role.id);
  });

  afterAll(async () => {
    await prisma.permissions.delete({ where: { id: permission.id } });
    await prisma.roles.delete({ where: { id: role.id } });
    await prisma.$disconnect();
  });
});
