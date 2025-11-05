import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Department CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let country;

  beforeAll(async () => {
    country = await prisma.country.create({ data: { name: "Perú2" } });
  });

  it("Crea un departamento", async () => {
    const department = await prisma.department.create({
      data: { name: "Lima2", countryId: country.id },
    });
    expect(department.name).toBe("Lima2");
  });
});
