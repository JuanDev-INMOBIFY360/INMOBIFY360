import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Roles CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Crea un rol", async () => {
    const role = await prisma.roles.create({
      data: { name: "Administrador2" },
    });
    expect(role.name).toBe("Administrador2");
  });
});
