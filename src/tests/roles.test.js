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
  });

  it ("Debe obtener un rol de usuario por ID", async () => {
    const role = await prisma.roles.findUnique({
      where: { name: "Tester" },
    });
    expect(role).toHaveProperty("id");
    expect(role.name).toBe("Tester");
  });
  it("Debe obtener todos los roles de usuario", async () =>{
    const roles = await prisma.roles.findMany();
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);
  })

  it("Debe actualizar un rol de usuario", async () =>{
    const roleToUpdate = await prisma.roles.update({
      where: { name: "Tester" },
      data: { name: "Updated Tester" },
    });
    expect(roleToUpdate.name).toBe("Updated Tester");
  });

  it("Debe eliminar un rol de usuario", async () =>{
    const roleToDelete = await prisma.roles.delete({
      where: { name: "Updated Tester" },
    });
    expect(roleToDelete.name).toBe("Updated Tester");
    })
  });



