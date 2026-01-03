import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ================================
   CONFIG
================================ */

const MODULES = [
  "property",
  "user",
  "owner",
  "role",
  "country",
  "department",
  "city",
  "neighborhood",
  "typeProperty",
];

const ACTIONS = [
  { action: "CREATE", displayName: "Crear" },
  { action: "READ", displayName: "Ver" },
  { action: "UPDATE", displayName: "Editar" },
  { action: "DELETE", displayName: "Eliminar" },
  { action: "CHANGE_STATE", displayName: "Cambiar estado" },
];

const DEPARTMENTS_COLOMBIA = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas",
  "Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca",
  "Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño",
  "Norte de Santander","Putumayo","Quindío","Risaralda",
  "San Andrés y Providencia","Santander","Sucre","Tolima",
  "Valle del Cauca","Vaupés","Vichada","Bogotá D.C.",
];

const TYPE_PROPERTIES = [
  "Apartamento","Casa","Casa Campestre","Finca","Lote","Oficina",
  "Consultorio","Local Comercial","Bodega","Edificio","Proyecto",
];

/* ================================
   SEED
================================ */

async function main() {
  console.log("🌱 Iniciando seed completo (RBAC + Locations)...");

  /* =========================
     ROLES
  ========================= */
  const adminRole = await prisma.roles.upsert({
    where: { name: "Administrador" },
    update: {},
    create: {
      name: "Administrador",
      description: "Rol administrador del sistema",
    },
  });

  await prisma.roles.upsert({
    where: { name: "Usuario" },
    update: {},
    create: {
      name: "Usuario",
      description: "Rol usuario estándar",
    },
  });

  /* =========================
     PERMISSIONS
  ========================= */
  const permissionsMap = {};

  for (const module of MODULES) {
    permissionsMap[module] = await prisma.permissions.upsert({
      where: { name: module },
      update: {},
      create: {
        name: module,
        displayName: module.charAt(0).toUpperCase() + module.slice(1),
      },
    });
  }

  /* =========================
     PRIVILEGES
  ========================= */
  for (const permission of Object.values(permissionsMap)) {
    for (const act of ACTIONS) {
      await prisma.privileges.upsert({
        where: {
          action_permissionId: {
            action: act.action,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          action: act.action,
          displayName: act.displayName,
          permissionId: permission.id,
        },
      });
    }
  }

  /* =========================
     ASSIGN ADMIN PRIVILEGES
  ========================= */
  for (const permission of Object.values(permissionsMap)) {
    const rolePermission = await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });

    const privileges = await prisma.privileges.findMany({
      where: { permissionId: permission.id },
    });

    for (const privilege of privileges) {
      await prisma.rolePermissionPrivilege.upsert({
        where: {
          rolePermissionId_privilegeId: {
            rolePermissionId: rolePermission.id,
            privilegeId: privilege.id,
          },
        },
        update: {},
        create: {
          rolePermissionId: rolePermission.id,
          privilegeId: privilege.id,
        },
      });
    }
  }

  /* =========================
     ADMIN USER
  ========================= */
  if (!process.env.USER_ADMIN || !process.env.USER_ADMIN_PASSWORD) {
    throw new Error("❌ USER_ADMIN o USER_ADMIN_PASSWORD no definidos");
  }

  const password = await bcrypt.hash(
    process.env.USER_ADMIN_PASSWORD,
    Number(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10
  );

  await prisma.user.upsert({
    where: { email: process.env.USER_ADMIN },
    update: {
      password,
      roleId: adminRole.id,
    },
    create: {
      email: process.env.USER_ADMIN,
      password,
      name: "Admin",
      roleId: adminRole.id,
    },
  });

  /* =========================
     COUNTRY
  ========================= */
  console.log("🌍 Creando país Colombia");

  const colombia = await prisma.country.upsert({
    where: { name: "Colombia" },
    update: {},
    create: { name: "Colombia" },
  });

  console.log("🇨🇴 Colombia ID:", colombia.id);

  /* =========================
     DEPARTMENTS
  ========================= */
  for (const name of DEPARTMENTS_COLOMBIA) {
    await prisma.department.upsert({
      where: {
        name_countryId: {
          name,
          countryId: colombia.id,
        },
      },
      update: {},
      create: {
        name,
        countryId: colombia.id,
      },
    });
  }

  console.log("🏛️ Departamentos creados");

  /* =========================
     TYPE PROPERTY
  ========================= */
  for (const name of TYPE_PROPERTIES) {
    await prisma.typeProperty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("🏠 Tipos de propiedad creados");
  console.log("✅ Seed completo ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
