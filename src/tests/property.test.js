import { PrismaClient, PropertyState } from "@prisma/client";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo Property", () => {
  let propertyId, owner, country, department, city, neighborhood, typeProperty;

  beforeAll(async () => {
    country = await prisma.country.create({ data: { name: "ColombiaTest" } });
    department = await prisma.department.create({
      data: { name: "AntioquiaTest", countryId: country.id },
    });
    city = await prisma.city.create({
      data: { name: "MedellínTest", departmentId: department.id },
    });
    neighborhood = await prisma.neighborhood.create({
      data: { name: "LaurelesTest", cityId: city.id },
    });
    typeProperty = await prisma.typeProperty.create({
      data: { name: "CasaTest" },
    });
    owner = await prisma.owner.create({
      data: { name: "Juan Tester", email: "juan.tester@example.com" },
    });
  });

  afterAll(async () => {
    await prisma.property.deleteMany();
    await prisma.owner.deleteMany();
    await prisma.typeProperty.deleteMany();
    await prisma.neighborhood.deleteMany();
    await prisma.city.deleteMany();
    await prisma.department.deleteMany();
    await prisma.country.deleteMany();
    await prisma.$disconnect();
  });

  it("Debe crear una propiedad", async () => {
    const property = await prisma.property.create({
      data: {
        precio: 1000000,
        area: 120,
        habitaciones: 3,
        banos: 2,
        direccion: "Calle 123 #45-67",
        estado: PropertyState.AVAILABLE,
        ownerId: owner.id,
        countryId: country.id,
        departmentId: department.id,
        cityId: city.id,
        neighborhoodId: neighborhood.id,
        typePropertyId: typeProperty.id,
      },
    });
    propertyId = property.id;
    expect(property).toHaveProperty("id");
  });

  it("Debe obtener una propiedad", async () => {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    expect(property).not.toBeNull();
  });

  it("Debe actualizar una propiedad", async () => {
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { precio: 1200000 },
    });
    expect(updated.precio).toBe(1200000);
  });

  it("Debe eliminar la propiedad", async () => {
    const deleted = await prisma.property.delete({ where: { id: propertyId } });
    expect(deleted.id).toBe(propertyId);
  });
});
