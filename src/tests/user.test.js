import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("User CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let role;

  beforeAll(async () => {
    role = await prisma.roles.create({ data: { name: "UserTester" } });
  });

  it("Crea un usuario", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashedpassword",
        name: "Test User",
        roleId: role.id,
      },
    });
    expect(user).toHaveProperty("id");
  });
});
