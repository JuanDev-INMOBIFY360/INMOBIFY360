import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const deps = await prisma.department.findMany({ take: 100, orderBy: { id: 'asc' } });
    console.log('Found', deps.length, 'departments');
    for (const d of deps) {
      console.log(`${d.id}\t${d.name}`);
    }
  } catch (e) {
    console.error('Error querying departments:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
