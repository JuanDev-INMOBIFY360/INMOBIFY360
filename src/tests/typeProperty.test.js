import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("TypeProperty CRUD", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Crea un tipo de propiedad", async () => {
    const type = await prisma.typeProperty.create({
      data: { name: "Casa" },
    });
    expect(type).toHaveProperty("id");
  });
});
