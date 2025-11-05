import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo TypeProperty", () => {
  let typeId;

  afterAll(async () => {
    await prisma.typeProperty.deleteMany({ where: { name: { contains: "TypeTest" } } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("Debe crear un typeProperty", async () => {
    const tp = await prisma.typeProperty.create({ data: { name: "TypeTest" } });
    typeId = tp.id;
    expect(tp).toHaveProperty("id");
    expect(tp.name).toBe("TypeTest");
  });

  it("Debe obtener typeProperty por ID", async () => {
    const tp = await prisma.typeProperty.findUnique({ where: { id: typeId } });
    expect(tp).not.toBeNull();
  });

  it("Debe listar typeProperties", async () => {
    const list = await prisma.typeProperty.findMany();
    expect(Array.isArray(list)).toBe(true);
  });

  it("Debe actualizar typeProperty", async () => {
    const updated = await prisma.typeProperty.update({
      where: { id: typeId },
      data: { name: "TypeTestUpdated" },
    });
    expect(updated.name).toBe("TypeTestUpdated");
  });

  it("Debe eliminar typeProperty", async () => {
    const del = await prisma.typeProperty.delete({ where: { id: typeId } });
    expect(del.id).toBe(typeId);
  });
});
