import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Permissions CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let role;

  beforeAll(async () => {
    role = await prisma.roles.create({ data: { name: "Tester" } });
  });

  it("Crea un permiso", async () => {
    const permission = await prisma.permissions.create({
      data: { name: "Manage Users", roleId: role.id },
    });
    expect(permission.name).toBe("Manage Users");
  });
});
