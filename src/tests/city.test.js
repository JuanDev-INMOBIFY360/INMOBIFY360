import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('City CRUD', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let department;

  beforeAll(async () => {
    const country = await prisma.country.create({ data: { name: 'Chile2' } });
    department = await prisma.department.create({
      data: { name: 'Santiago2', countryId: country.id },
    });
  });

  it('Crea una ciudad', async () => {
    const city = await prisma.city.create({
      data: { name: 'Providencia2', departmentId: department.id },
    });
    expect(city).toHaveProperty('id');
  });
});
