import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let permission;

beforeAll(async () => {
  // Aseguramos que exista al menos un permiso
  permission = await prisma.permissions.upsert({
    where: { name: "Permiso General" },
    update: {},
    create: { name: "Permiso General" },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Privileges CRUD", () => {
  it("Crea o usa un privilegio READ asociado a un permiso existente", async () => {
    const privilege = await prisma.privileges.upsert({
      where: {
        action_permissionId: {
          action: "READ",
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        action: "READ",
        permissionId: permission.id,
      },
    });

    expect(privilege.action).toBe("READ");
    expect(privilege.permissionId).toBe(permission.id);
  });
});
