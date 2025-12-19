import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Country CRUD', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Crea un país', async () => {
    const country = await prisma.country.create({
      data: { name: 'Colombia2' },
    });
    expect(country).toHaveProperty('id');
  });

  it('Lee países', async () => {
    const countries = await prisma.country.findMany();
    expect(countries.length).toBeGreaterThan(0);
  });

  it('Actualiza un país', async () => {
    const updated = await prisma.country.update({
      where: { name: 'Colombia2' },
      data: { name: 'Ecuador2' },
    });
    expect(updated.name).toBe('Ecuador2');
  });

  it('Elimina un país', async () => {
    const deleted = await prisma.country.delete({
      where: { name: 'Ecuador2' },
    });
    expect(deleted).toHaveProperty('id');
  });
});
