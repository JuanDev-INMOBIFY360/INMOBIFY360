import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Pruebas de roles de usuario", () => {
  // Limpieza antes de cada test (opcional)
  beforeEach(async () => {
    await prisma.roles.deleteMany(); // limpia la tabla de roles
  });

  // Cierra la conexión al terminar los tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Debe crear un rol de usuario", async () => {
    const newRole = await prisma.roles.create({
      data: {
        name: "Tester",
        description: "Rol para pruebas",
      },
    });

    expect(newRole).toHaveProperty("id");
    expect(newRole.name).toBe("Tester");
    expect(newRole.description).toBe("Rol para pruebas");
  });
  
});

