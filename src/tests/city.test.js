import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("City CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let department;

  beforeAll(async () => {
    const country = await prisma.country.create({ data: { name: "Chile" } });
    department = await prisma.department.create({
      data: { name: "Santiago", countryId: country.id },
    });
  });

  it("Crea una ciudad", async () => {
    const city = await prisma.city.create({
      data: { name: "Providencia", departmentId: department.id },
    });
    expect(city).toHaveProperty("id");
  });
});
