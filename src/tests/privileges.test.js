import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let permission;

beforeAll(async () => {
  // Aseguramos que exista un permiso válido
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
  it("Crea un privilegio válido (READ)", async () => {
    const privilege = await prisma.privileges.upsert({
      where: {
        // combinamos action + permissionId para que no se repita
        action_permissionId: {
          action: "READ",
          permissionId: permission.id,
        },
      },
      update: {},
      create: { action: "READ", permissionId: permission.id },
    });

    expect(privilege.action).toBe("READ");
    expect(privilege.permissionId).toBe(permission.id);
  });
});
