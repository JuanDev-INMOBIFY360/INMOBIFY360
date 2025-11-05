import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo Permissions", () => {
  let role;
  let permissionId;

  beforeAll(async () => {
    role = await prisma.roles.create({ data: { name: "PERM_TEST_ROLE" } });
  });

  afterAll(async () => {
    await prisma.permissions.deleteMany({ where: { id: permissionId } }).catch(() => {});
    await prisma.roles.deleteMany({ where: { id: role.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("Debe crear una permission", async () => {
    const perm = await prisma.permissions.create({
      data: {
        name: "PERM_TEST",
        roleId: role.id,
      },
    });
    permissionId = perm.id;
    expect(perm).toHaveProperty("id");
    expect(perm.name).toBe("PERM_TEST");
  });

  it("Debe obtener permission por ID", async () => {
    const perm = await prisma.permissions.findUnique({ where: { id: permissionId } });
    expect(perm).not.toBeNull();
    expect(perm.roleId).toBe(role.id);
  });

  it("Debe listar permissions", async () => {
    const list = await prisma.permissions.findMany();
    expect(Array.isArray(list)).toBe(true);
  });

  it("Debe actualizar permission", async () => {
    const updated = await prisma.permissions.update({
      where: { id: permissionId },
      data: { name: "PERM_TEST_UPDATED" },
    });
    expect(updated.name).toBe("PERM_TEST_UPDATED");
  });

  it("Debe eliminar permission", async () => {
    const del = await prisma.permissions.delete({ where: { id: permissionId } });
    expect(del.id).toBe(permissionId);
  });
});
