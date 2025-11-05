import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe(" Pruebas del modelo Roles", () => {
  let roleId;

  afterAll(async () => {
    await prisma.roles.deleteMany({ where: { name: "TEST_ROLE_UPDATED" } });
    await prisma.roles.deleteMany({ where: { name: "TEST_ROLE" } });
    await prisma.$disconnect();
  });

  it("Debe crear un rol", async () => {
    const newRole = await prisma.roles.create({
      data: {
        name: "TEST_ROLE",
      },
    });
    roleId = newRole.id;
    expect(newRole).toHaveProperty("id");
    expect(newRole.name).toBe("TEST_ROLE");
  });

  it("Debe obtener un rol por ID", async () => {
    const role = await prisma.roles.findUnique({ where: { id: roleId } });
    expect(role).not.toBeNull();
    expect(role.name).toBe("TEST_ROLE");
  });

  it("Debe obtener todos los roles", async () => {
    const roles = await prisma.roles.findMany();
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);
  });

  it("Debe actualizar un rol", async () => {
    const updatedRole = await prisma.roles.update({
      where: { id: roleId },
      data: { name: "TEST_ROLE_UPDATED" },
    });
    expect(updatedRole.name).toBe("TEST_ROLE_UPDATED");
  });

  it("Debe eliminar un rol", async () => {
    const deletedRole = await prisma.roles.delete({
      where: { id: roleId },
    });
    expect(deletedRole).toHaveProperty("id");
  });
});
