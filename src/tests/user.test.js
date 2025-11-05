import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("🧪 Pruebas del modelo User", () => {
  let role;
  let userId;

  beforeAll(async () => {
    role = await prisma.roles.create({
      data: { name: "USER_TEST_ROLE" },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: "test_user@example.com" } });
    await prisma.roles.deleteMany({ where: { name: "USER_TEST_ROLE" } });
    await prisma.$disconnect();
  });

  it("Debe crear un usuario", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    const newUser = await prisma.user.create({
      data: {
        email: "test_user@example.com",
        password: hashed,
        name: "Usuario de Prueba",
        roleId: role.id,
      },
    });
    userId = newUser.id;

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toBe("test_user@example.com");
  });

  it("Debe obtener un usuario por ID", async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).not.toBeNull();
    expect(user.email).toBe("test_user@example.com");
  });

  it("Debe listar todos los usuarios", async () => {
    const users = await prisma.user.findMany();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it("Debe actualizar un usuario", async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: "Usuario Actualizado" },
    });
    expect(updatedUser.name).toBe("Usuario Actualizado");
  });

  it("Debe eliminar un usuario", async () => {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    expect(deletedUser.id).toBe(userId);
  });
});
