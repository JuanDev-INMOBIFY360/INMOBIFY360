import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Neighborhood CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let city;

  beforeAll(async () => {
    const country = await prisma.country.create({ data: { name: "Argentina" } });
    const dept = await prisma.department.create({
      data: { name: "Buenos Aires2", countryId: country.id },
    });
    city = await prisma.city.create({
      data: { name: "Palermo", departmentId: dept.id },
    });
  });

  it("Crea un barrio", async () => {
    const neighborhood = await prisma.neighborhood.create({
      data: { name: "Las Cañitas", cityId: city.id },
    });
    expect(neighborhood.name).toBe("Las Cañitas");
  });
});
