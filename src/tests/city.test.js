import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo City", () => {
  let country;
  let department;
  let cityId;

  beforeAll(async () => {
    country = await prisma.country.create({ data: { name: "CityCountryTest" } });
    department = await prisma.department.create({
      data: { name: "CityDepartmentTest", countryId: country.id },
    });
  });

  afterAll(async () => {
    await prisma.city.deleteMany({ where: { name: { contains: "CityTest" } } }).catch(() => {});
    await prisma.department.deleteMany({ where: { id: department.id } }).catch(() => {});
    await prisma.country.deleteMany({ where: { id: country.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("Debe crear una ciudad", async () => {
    const city = await prisma.city.create({
      data: { name: "CityTest", departmentId: department.id },
    });
    cityId = city.id;
    expect(city).toHaveProperty("id");
    expect(city.name).toBe("CityTest");
  });

  it("Debe obtener la ciudad creada", async () => {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    expect(city).not.toBeNull();
    expect(city.departmentId).toBe(department.id);
  });

  it("Debe listar ciudades", async () => {
    const cities = await prisma.city.findMany();
    expect(Array.isArray(cities)).toBe(true);
  });

  it("Debe actualizar la ciudad", async () => {
    const updated = await prisma.city.update({
      where: { id: cityId },
      data: { name: "CityTestUpdated" },
    });
    expect(updated.name).toBe("CityTestUpdated");
  });

  it("Debe eliminar la ciudad", async () => {
    const deleted = await prisma.city.delete({ where: { id: cityId } });
    expect(deleted.id).toBe(cityId);
  });
});
