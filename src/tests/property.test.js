import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let city, neighborhood, type, owner;

beforeAll(async () => {
  const country = await prisma.country.upsert({
    where: { name: "Colombia" },
    update: {},
    create: { name: "Colombia" },
  });

  const department = await prisma.department.upsert({
    where: { name: "Antioquia" },
    update: {},
    create: { name: "Antioquia", countryId: country.id },
  });

  city = await prisma.city.upsert({
    where: { name: "Medellín" },
    update: {},
    create: { name: "Medellín", departmentId: department.id },
  });

  neighborhood = await prisma.neighborhood.upsert({
    where: { name: "El Poblado" },
    update: {},
    create: { name: "El Poblado", cityId: city.id },
  });

  type = await prisma.typeProperty.upsert({
    where: { name: "Apartamento" },
    update: {},
    create: { name: "Apartamento" },
  });

  owner = await prisma.owner.upsert({
    where: { email: "carlos@example.com" },
    update: {},
    create: { name: "Carlos Ramírez", email: "carlos@example.com" },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Property CRUD", () => {
  it("Crea una propiedad sin conflictos de unique", async () => {
    const property = await prisma.property.create({
      data: {
        title: "Apartamento moderno en El Poblado",
        description: "Hermoso apartamento con vista a la ciudad",
        price: 300000000,
        neighborhoodId: neighborhood.id,
        typePropertyId: type.id,
        ownerId: owner.id,
      },
    });

    expect(property.title).toBe("Apartamento moderno en El Poblado");
    expect(property.price).toBe(300000000);
  });
});
