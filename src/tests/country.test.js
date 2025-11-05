import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Country CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Crea un país", async () => {
    const country = await prisma.country.create({
      data: { name: "Colombia" },
    });
    expect(country).toHaveProperty("id");
  });

  it("Lee países", async () => {
    const countries = await prisma.country.findMany();
    expect(countries.length).toBeGreaterThan(0);
  });

  it("Actualiza un país", async () => {
    const updated = await prisma.country.update({
      where: { name: "Colombia" },
      data: { name: "Ecuador" },
    });
    expect(updated.name).toBe("Ecuador");
  });

  it("Elimina un país", async () => {
    const deleted = await prisma.country.delete({
      where: { name: "Ecuador" },
    });
    expect(deleted).toHaveProperty("id");
  });
});
