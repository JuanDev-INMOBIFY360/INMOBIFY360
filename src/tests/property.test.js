import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Property CRUD', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let owner, country, department, city, neighborhood, type;

  beforeAll(async () => {
    country = await prisma.country.create({ data: { name: 'México' } });
    department = await prisma.department.create({
      data: { name: 'CDMX', countryId: country.id },
    });
    city = await prisma.city.create({
      data: { name: 'Coyoacán', departmentId: department.id },
    });
    neighborhood = await prisma.neighborhood.create({
      data: { name: 'Del Carmen', cityId: city.id },
    });
    type = await prisma.typeProperty.create({ data: { name: 'Apartamento2' } });
    owner = await prisma.owner.create({
      data: { name: 'Carlos Ramírez', email: 'carlos@example.com' },
    });
  });

  it('Crea una propiedad', async () => {
    const property = await prisma.property.create({
      data: {
        precio: 150000,
        direccion: 'Calle 123 #45-67',
        ownerId: owner.id,
        countryId: country.id,
        departmentId: department.id,
        cityId: city.id,
        neighborhoodId: neighborhood.id,
        typePropertyId: type.id,
      },
    });
    expect(property).toHaveProperty('id');
  });
});
