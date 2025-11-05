import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Privileges CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let permission;

  beforeAll(async () => {
    const role = await prisma.roles.create({ data: { name: "PrivRole" } });
    permission = await prisma.permissions.create({
      data: { name: "Access Control", roleId: role.id },
    });
  });

  it("Crea un privilegio", async () => {
    const privilege = await prisma.privileges.create({
      data: { action: "READ", permissionId: permission.id },
    });
    expect(privilege.action).toBe("READ");
  });
});
