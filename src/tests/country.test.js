import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo Country", () => {
  let countryId;

  afterAll(async () => {
    await prisma.country.deleteMany({ where: { name: "Testlandia" } });
    await prisma.$disconnect();
  });

  it("Debe crear un país", async () => {
    const country = await prisma.country.create({
      data: { name: "Testlandia" },
    });
    countryId = country.id;

    expect(country).toHaveProperty("id");
    expect(country.name).toBe("Testlandia");
  });

  it("Debe obtener el país creado", async () => {
    const country = await prisma.country.findUnique({ where: { id: countryId } });
    expect(country).not.toBeNull();
    expect(country.name).toBe("Testlandia");
  });

  it("Debe listar países", async () => {
    const countries = await prisma.country.findMany();
    expect(Array.isArray(countries)).toBe(true);
  });

  it("Debe actualizar el país", async () => {
    const updated = await prisma.country.update({
      where: { id: countryId },
      data: { name: "Testlandia 2.0" },
    });
    expect(updated.name).toBe("Testlandia 2.0");
  });

  it("Debe eliminar el país", async () => {
    const deleted = await prisma.country.delete({ where: { id: countryId } });
    expect(deleted.id).toBe(countryId);
  });
});
