import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Roles CRUD', () => {
  let role;

  it('Crea un rol', async () => {
    role = await prisma.roles.create({
      data: { name: 'Administrador_' + Date.now() },
    });
    expect(role.name).toContain('Administrador_');
  });

  afterAll(async () => {
    // Limpieza
    await prisma.roles.delete({ where: { id: role.id } });
    await prisma.$disconnect();
  });
});
