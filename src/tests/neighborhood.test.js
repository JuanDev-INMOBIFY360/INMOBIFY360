import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe(" Pruebas del modelo Neighborhood", () => {
  let country, department, city;
  let neighborhoodId;

  beforeAll(async () => {
    country = await prisma.country.create({ data: { name: "NB_CountryTest" } });
    department = await prisma.department.create({ data: { name: "NB_DepTest", countryId: country.id } });
    city = await prisma.city.create({ data: { name: "NB_CityTest", departmentId: department.id } });
  });

  afterAll(async () => {
    await prisma.neighborhood.deleteMany({ where: { name: { contains: "NB_" } } }).catch(() => {});
    await prisma.city.deleteMany({ where: { id: city.id } }).catch(() => {});
    await prisma.department.deleteMany({ where: { id: department.id } }).catch(() => {});
    await prisma.country.deleteMany({ where: { id: country.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("Debe crear un barrio (neighborhood)", async () => {
    const nb = await prisma.neighborhood.create({
      data: { name: "NB_Test", cityId: city.id },
    });
    neighborhoodId = nb.id;
    expect(nb).toHaveProperty("id");
    expect(nb.cityId).toBe(city.id);
  });

  it("Debe obtener el barrio por ID", async () => {
    const nb = await prisma.neighborhood.findUnique({ where: { id: neighborhoodId } });
    expect(nb).not.toBeNull();
    expect(nb.name).toBe("NB_Test");
  });

  it("Debe listar barrios", async () => {
    const list = await prisma.neighborhood.findMany();
    expect(Array.isArray(list)).toBe(true);
  });

  it("Debe actualizar el barrio", async () => {
    const upd = await prisma.neighborhood.update({
      where: { id: neighborhoodId },
      data: { name: "NB_Test_Updated" },
    });
    expect(upd.name).toBe("NB_Test_Updated");
  });

  it("Debe eliminar el barrio", async () => {
    const del = await prisma.neighborhood.delete({ where: { id: neighborhoodId } });
    expect(del.id).toBe(neighborhoodId);
  });
});
