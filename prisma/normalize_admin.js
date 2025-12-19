import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

dotenv.config();

async function main() {
  const adminEmail = process.env.USER_ADMIN?.trim();
  const adminPassword = process.env.USER_ADMIN_PASSWORD?.trim() || '';
  const saltRounds = parseInt(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10;

  if (!adminEmail) {
    console.log('No USER_ADMIN set in env; aborting.');
    return;
  }

  // Find any user that contains the admin local-part to catch malformed entries
  const possible = await prisma.user.findFirst({
    where: { email: { contains: adminEmail.split('@')[0] } },
  });

  const hashed = await bcrypt.hash(adminPassword, saltRounds);

  if (possible) {
    console.log('Found existing user, normalizing email + password:', possible.email);
    await prisma.user.update({
      where: { id: possible.id },
      data: { email: adminEmail, password: hashed, name: 'Admin', roleId: 1 },
    });
    console.log('Admin normalized.');
  } else {
    console.log('No existing user found; creating admin user.');
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: 'Admin',
        roleId: 1,
      },
    });
    console.log('Admin created.');
  }
}

main()
  .catch((e) => {
    console.error('Error normalizing admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
