import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

describe("Pruebas de permisoss de usuario", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("Debe crear un privilegio de usuario", async () => {
    const newPrivilege = await prisma.privileges.create({
      data: {
        name: "ACCESS_DASHBOARD",
        description: "Privilegio para acceder al dashboard",
      },
    });
    expect(newPrivilege).toHaveProperty("id");
    expect(newPrivilege.name).toBe("ACCESS_DASHBOARD");
    expect(newPrivilege.description).toBe(
      "Privilegio para acceder al dashboard"
    );
  });
  it("Debe obtener un privilegio de usuario por ID", async () => {
    const privilege = await prisma.privileges.findUnique({
      where: { name: "ACCESS_DASHBOARD" },
    });
    expect(privilege).toHaveProperty("id");
    expect(privilege.name).toBe("ACCESS_DASHBOARD");
  });
  it("Debe obtener todos los privilegios de usuario", async () => {
    const privileges = await prisma.privileges.findMany();
    expect(Array.isArray(privileges)).toBe(true);
    expect(privileges.length).toBeGreaterThan(0);
  });
  it("Debe actualizar un privilegio de usuario", async () => {
    const privilegeToUpdate = await prisma.privileges.update({
      where: { name: "ACCESS_DASHBOARD" },
      data: { name: "UPDATED_ACCESS_DASHBOARD" },
    });
    expect(privilegeToUpdate.name).toBe("UPDATED_ACCESS_DASHBOARD");
  });
  it("Debe eliminar un privilegio de usuario", async () => {
    const privilegeToDelete = await prisma.privileges.delete({
      where: { name: "UPDATED_ACCESS_DASHBOARD" },
    });
    expect(privilegeToDelete.name).toBe("UPDATED_ACCESS_DASHBOARD");
  });
});
