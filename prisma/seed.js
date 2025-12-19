import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ===============================
  //  Países
  // ===============================
  const countries = {};
  for (const name of ['Colombia', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Brasil', 'Uruguay']) {
    countries[name] = await prisma.country.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // ===============================
  //  Departamentos (Colombia)
  // ===============================
  const departments = {};
  const colombia = countries['Colombia'];

  for (const name of ['Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico']) {
    departments[name] = await prisma.department.upsert({
      where: {
        name_countryId: { name, countryId: colombia.id },
      },
      update: {},
      create: { name, countryId: colombia.id },
    });
  }

  // ===============================
  //  Ciudades
  // ===============================
  const cities = {};
  const cityMap = {
    Bogotá: 'Cundinamarca',
    Medellín: 'Antioquia',
    Cali: 'Valle del Cauca',
    Barranquilla: 'Atlántico',
  };

  for (const [city, dept] of Object.entries(cityMap)) {
    cities[city] = await prisma.city.upsert({
      where: {
        name_departmentId: {
          name: city,
          departmentId: departments[dept].id,
        },
      },
      update: {},
      create: {
        name: city,
        departmentId: departments[dept].id,
      },
    });
  }

  // ===============================
  //  Barrios
  // ===============================
  const neighborhoods = {
    Chapinero: 'Bogotá',
    'El Poblado': 'Medellín',
    'San Antonio': 'Cali',
    'El Prado': 'Barranquilla',
  };

  for (const [name, city] of Object.entries(neighborhoods)) {
    await prisma.neighborhood.upsert({
      where: {
        name_cityId: {
          name,
          cityId: cities[city].id,
        },
      },
      update: {},
      create: {
        name,
        cityId: cities[city].id,
      },
    });
  }

  // ===============================
  //  Tipos de propiedad
  // ===============================
  for (const name of ['Apartamento', 'Casa', 'Oficina', 'Local Comercial']) {
    await prisma.typeProperty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // ===============================
  //  Roles
  // ===============================
  const adminRole = await prisma.roles.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: { name: 'Administrador' },
  });

  await prisma.roles.upsert({
    where: { name: 'Propietario' },
    update: {},
    create: { name: 'Propietario' },
  });

  await prisma.roles.upsert({
    where: { name: 'Usuario' },
    update: {},
    create: { name: 'Usuario' },
  });

  // ===============================
  //  Permisos + Privilegios (ADMIN)
  // ===============================
  const modules = [
    'property',
    'user',
    'owner',
    'role',
    'country',
    'city',
    'department',
    'neighborhood',
    'typeProperty',
    'permissions',
    'privileges',
    'auth',
  ];

  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'CHANGE_STATE'];

  for (const module of modules) {
    const permission = await prisma.permissions.upsert({
      where: {
        name_roleId: {
          name: module,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        name: module,
        roleId: adminRole.id,
      },
    });

    for (const action of actions) {
      await prisma.privileges.upsert({
        where: {
          action_permissionId: {
            action,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          permissionId: permission.id,
          action,
        },
      });
    }
  }

  // ===============================
  //  Usuario Administrador
  // ===============================
  if (!process.env.USER_ADMIN || !process.env.USER_ADMIN_PASSWORD) {
    throw new Error('❌ USER_ADMIN o USER_ADMIN_PASSWORD no definidos');
  }

  const saltRounds = Number(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10;
  const password = await bcrypt.hash(process.env.USER_ADMIN_PASSWORD, saltRounds);

  await prisma.user.upsert({
    where: { email: process.env.USER_ADMIN },
    update: {
      password,
      roleId: adminRole.id,
    },
    create: {
      email: process.env.USER_ADMIN,
      password,
      name: 'Admin',
      roleId: adminRole.id,
    },
  });

  // ===============================
  //  Propietarios
  // ===============================
  const owners = [
    ['Carlos Rodríguez', 'carlos.rodriguez@inmobify360.com'],
    ['María González', 'maria.gonzalez@inmobify360.com'],
    ['Juan Martínez', 'juan.martinez@inmobify360.com'],
  ];

  for (const [name, email] of owners) {
    await prisma.owner.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        phone: '+57 300 0000000',
        document: Math.random().toString().slice(2, 12),
      },
    });
  }

  console.log('✅ Seed finalizado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
