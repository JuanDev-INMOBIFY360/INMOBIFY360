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
      { name: "permissions", roleId: 1 },
      { name: "privileges", roleId: 1 },
      { name: "auth", roleId: 1 },
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

  // ===============================
  //  Propietarios
  // ===============================
  await prisma.owner.createMany({
    data: [
      {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@inmobify360.com",
        phone: "+57 300 1234567",
        document: "1234567890",
      },
      {
        name: "María González",
        email: "maria.gonzalez@inmobify360.com",
        phone: "+57 300 2345678",
        document: "0987654321",
      },
      {
        name: "Juan Martínez",
        email: "juan.martinez@inmobify360.com",
        phone: "+57 300 3456789",
        document: "1122334455",
      },
    ],
    skipDuplicates: true,
  });

  // ===============================
  //  Propiedades con Imágenes
  // ===============================
  const owners = await prisma.owner.findMany();
  const types = await prisma.typeProperty.findMany();
  const cities = await prisma.city.findMany();
  const neighborhoods = await prisma.neighborhood.findMany();
  const countries = await prisma.country.findMany();

  if (owners.length >= 3 && types.length > 0 && cities.length > 0) {
    await prisma.property.createMany({
      data: [
        {
          titulo: "Apartamento Moderno en El Poblado",
          descripcion: "Hermoso apartamento con vista a la ciudad, completamente renovado con acabados de lujo. Incluye cocina integral, 2 habitaciones y 2 baños.",
          precio: 450000000,
          area: 120,
          areaPrivada: 100,
          habitaciones: 2,
          banos: 2,
          parqueaderos: 1,
          estrato: 6,
          piso: 15,
          antiguedad: 3,
          administracion: 850000,
          direccion: "Calle 10 # 45-67, El Poblado, Medellín",
          latitud: 6.2247,
          longitud: -75.5698,
          imagenes: JSON.stringify([
            {
              url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/1-living",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/1-bedroom",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/1-kitchen",
              resource_type: "image"
            }
          ]),
          estado: "AVAILABLE",
          destacada: true,
          ownerId: owners[0].id,
          countryId: countries[0].id,
          departmentId: 1,
          cityId: cities[0]?.id || 1,
          neighborhoodId: neighborhoods[0]?.id || 1,
          typePropertyId: types[0]?.id || 1,
        },
        {
          titulo: "Casa Campestre en Envigado",
          descripcion: "Espaciosa casa de campo con amplios jardines, piscina y zona de parqueadero para 4 vehículos. Perfecta para familias grandes.",
          precio: 750000000,
          area: 450,
          areaPrivada: 380,
          habitaciones: 4,
          banos: 3,
          parqueaderos: 4,
          estrato: 6,
          piso: 0,
          antiguedad: 10,
          administracion: 0,
          direccion: "Carrera 25 # 30-15, Envigado",
          latitud: 6.1847,
          longitud: -75.5945,
          imagenes: JSON.stringify([
            {
              url: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/2-exterior",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1512623546118-a82214e2c9d7?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/2-pool",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/2-garden",
              resource_type: "image"
            }
          ]),
          estado: "AVAILABLE",
          destacada: true,
          ownerId: owners[1].id,
          countryId: countries[0].id,
          departmentId: 1,
          cityId: cities[1]?.id || 2,
          neighborhoodId: neighborhoods[1]?.id || 2,
          typePropertyId: types[1]?.id || 2,
        },
        {
          titulo: "Oficina Moderna en Centro Comercial",
          descripcion: "Excelente oficina en zona comercial de alto flujo. Cuenta con recepción, 3 despachos y sala de juntas. Perfecta para empresas.",
          precio: 350000000,
          area: 200,
          areaPrivada: 200,
          habitaciones: 0,
          banos: 2,
          parqueaderos: 2,
          estrato: 6,
          piso: 8,
          antiguedad: 5,
          administracion: 1200000,
          direccion: "Avenida Paseo Peatonal # 50-80, Centro",
          latitud: 6.2442,
          longitud: -75.5637,
          imagenes: JSON.stringify([
            {
              url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/3-office1",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/3-office2",
              resource_type: "image"
            },
            {
              url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
              public_id: "inmobify360/properties/3-meeting",
              resource_type: "image"
            }
          ]),
          estado: "AVAILABLE",
          destacada: false,
          ownerId: owners[2].id,
          countryId: countries[0].id,
          departmentId: 1,
          cityId: cities[2]?.id || 3,
          neighborhoodId: neighborhoods[2]?.id || 3,
          typePropertyId: types[2]?.id || 3,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Seed completado con éxito - 3 propiedades precargadas");
}

main()
  .catch((e) => {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
