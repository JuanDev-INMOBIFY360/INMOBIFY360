import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Owner CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Crea un propietario", async () => {
    const owner = await prisma.owner.create({
      data: { name: "Juan Pérez", email: "juanp@example.com" },
    });
    expect(owner).toHaveProperty("id");
  });
});
