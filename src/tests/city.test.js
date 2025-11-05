import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let department;

beforeAll(async () => {
  const country = await prisma.country.upsert({
    where: { name: "Chile" },
    update: {},
    create: { name: "Chile" },
  });

  department = await prisma.department.upsert({
    where: { name: "Santiago2" },
    update: {},
    create: { name: "Santiago2", countryId: country.id },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("City CRUD", () => {
  it("Crea una ciudad sin romper el unique", async () => {
    const city = await prisma.city.upsert({
      where: { name: "Valparaíso" },
      update: {},
      create: { name: "Valparaíso", departmentId: department.id },
    });

    expect(city.name).toBe("Valparaíso");
  });
});
