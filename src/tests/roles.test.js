import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Pruebas de roles de usuario", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Debe crear un rol de usuario", async () => {
    const newRole = await prisma.roles.create({
      data: {
        name: "Tester",
      },
    });

    expect(newRole).toHaveProperty("id");
    expect(newRole.name).toBe("Tester");
    expect(newRole.description).toBe("Rol para pruebas");
  });
  
});

