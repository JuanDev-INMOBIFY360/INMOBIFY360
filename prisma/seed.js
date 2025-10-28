import { PrismaClient } from "@prisma/client";
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
  // Permisos (para el rol Administrador)
  // ===============================
  await prisma.permissions.createMany({
    data: [
      { name: "property", roleId: 1 },
      { name: "user", roleId: 1 },
      { name: "owner", roleId: 1 },
      { name: "role", roleId: 1 },
      { name: "country", roleId: 1 },
      { name: "city", roleId: 1 },
      { name: "typeProperty", roleId: 1 },
      { name: "neighborhoods", roleId: 1 },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Privilegios (para el permiso property)
  // ===============================
  await prisma.privileges.createMany({
    data: [
      { permissionId: 1, action: "CREATE" },
      { permissionId: 1, action: "READ" },
      { permissionId: 1, action: "UPDATE" },
      { permissionId: 1, action: "DELETE" },
      { permissionId: 1, action: "CHANGE_STATE" },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Usuario administrador
  // ===============================
  await prisma.user.createMany({
    data: [
      {
        name: "Admin Inmobify360",
        email: "adminInmobify360@gmail.com",
        password: "adminInmobify123",
        roleId: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log(" Seed completado con éxito ");
}

main()
  .catch((e) => {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
