import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe(" Pruebas del modelo Owner", () => {
  let ownerId;

  afterAll(async () => {
    await prisma.owner.deleteMany({ where: { email: "owner.test@example.com" } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("Debe crear un owner", async () => {
    const owner = await prisma.owner.create({
      data: { name: "Owner Test", email: "owner.test@example.com", phone: "3001112222", document: "DOC123" },
    });
    ownerId = owner.id;
    expect(owner).toHaveProperty("id");
    expect(owner.email).toBe("owner.test@example.com");
  });

  it("Debe obtener un owner por ID", async () => {
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    expect(owner).not.toBeNull();
    expect(owner.name).toBe("Owner Test");
  });

  it("Debe listar owners", async () => {
    const owners = await prisma.owner.findMany();
    expect(Array.isArray(owners)).toBe(true);
  });

  it("Debe actualizar un owner", async () => {
    const updated = await prisma.owner.update({
      where: { id: ownerId },
      data: { phone: "3009998888" },
    });
    expect(updated.phone).toBe("3009998888");
  });

  it("Debe eliminar el owner", async () => {
    const deleted = await prisma.owner.delete({ where: { id: ownerId } });
    expect(deleted.id).toBe(ownerId);
  });
});
