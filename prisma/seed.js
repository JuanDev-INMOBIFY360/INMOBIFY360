import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log(" Iniciando seed...");

  // ===============================
  //  Países
  // ===============================
  await prisma.country.createMany({
    data: [
      { name: "Colombia" },
      { name: "Argentina" },
      { name: "Chile" },
      { name: "Perú" },
      { name: "Ecuador" },
      { name: "Brasil" },
      { name: "Uruguay" },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Departamentos (solo Colombia por ahora)
  // ===============================
  await prisma.department.createMany({
    data: [
      { name: "Cundinamarca", countryId: 1 },
      { name: "Antioquia", countryId: 1 },
      { name: "Valle del Cauca", countryId: 1 },
      { name: "Atlántico", countryId: 1 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Ciudades
  // ===============================
  await prisma.city.createMany({
    data: [
      { name: "Bogotá", departmentId: 1 },
      { name: "Medellín", departmentId: 2 },
      { name: "Cali", departmentId: 3 },
      { name: "Barranquilla", departmentId: 4 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Barrios
  // ===============================
  await prisma.neighborhood.createMany({
    data: [
      { name: "Chapinero", cityId: 1 },
      { name: "El Poblado", cityId: 2 },
      { name: "San Antonio", cityId: 3 },
      { name: "El Prado", cityId: 4 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Tipos de propiedad
  // ===============================
  await prisma.typeProperty.createMany({
    data: [
      { name: "Apartamento" },
      { name: "Casa" },
      { name: "Oficina" },
      { name: "Local Comercial" },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Roles
  // ===============================
  await prisma.roles.createMany({
    data: [
      { name: "Administrador" },
      { name: "Propietario" },
      { name: "Usuario" },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Permisos (para el rol Administrador)
  // ===============================
  await prisma.permissions.createMany({
    data: [
      { name: "property", roleId: 1 },
      { name: "user", roleId: 1 },
      { name: "owner", roleId: 1 },
      { name: "role", roleId: 1 },
      { name: "country", roleId: 1 },
      { name: "city", roleId: 1 },
      { name: "department", roleId: 1 },
      { name: "neighborhood", roleId: 1 },
      { name: "typeProperty", roleId: 1 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Privilegios (para todos los permisos del rol Administrador)
  // ===============================
  const adminPermissions = await prisma.permissions.findMany({
    where: { roleId: 1 },
  });

  for (const perm of adminPermissions) {
    await prisma.privileges.createMany({
      data: [
        { permissionId: perm.id, action: "CREATE" },
        { permissionId: perm.id, action: "READ" },
        { permissionId: perm.id, action: "UPDATE" },
        { permissionId: perm.id, action: "DELETE" },
        { permissionId: perm.id, action: "CHANGE_STATE" },
      ],
      skipDuplicates: true,
    });
  }

  // ===============================
  //  Usuario administrador (con contraseña hasheada)
  // ===============================
  const saltRounds = parseInt(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(process.env.USER_ADMIN_PASSWORD, saltRounds);

  await prisma.user.createMany({
    data: [
      {
        email: process.env.USER_ADMIN,
        password: hashedPassword,
        name: "Admin",
        roleId: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completado con éxito");
}

main()
  .catch((e) => {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
