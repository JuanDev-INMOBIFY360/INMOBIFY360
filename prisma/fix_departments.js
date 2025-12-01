import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DANE_DEPARTMENTS = {
  '05': 'ANTIOQUIA',
  '08': 'ATLÁNTICO',
  '11': 'BOGOTÁ, D.C.',
  '13': 'BOLÍVAR',
  '15': 'BOYACÁ',
  '17': 'CALDAS',
  '18': 'CAQUETÁ',
  '19': 'CAUCA',
  '20': 'CESAR',
  '23': 'CÓRDOBA',
  '25': 'CUNDINAMARCA',
  '27': 'CHOCÓ',
  '41': 'HUILA',
  '44': 'LA GUAJIRA',
  '47': 'MAGDALENA',
  '50': 'META',
  '52': 'NARIÑO',
  '54': 'NORTE DE SANTANDER',
  '63': 'QUINDÍO',
  '66': 'RISARALDA',
  '68': 'SAN ANDRÉS Y PROVIDENCIA',
  '70': 'SANTANDER',
  '73': 'SUCRE',
  '76': 'VALLE DEL CAUCA',
  '81': 'ARAUCA',
  '85': 'CASANARE',
  '86': 'PUTUMAYO',
  '91': 'AMAZONAS',
  '94': 'GUAINÍA',
  '95': 'GUAVIARE',
  '97': 'VAUPÉS',
  '99': 'VICHADA'
};

async function main(){
  try{
    const deps = await prisma.department.findMany({ orderBy: { id: 'asc' } });
    console.log('Total departments:', deps.length);
    for(const d of deps){
      const raw = d.name ? String(d.name).trim() : '';
      if(!/^\d{1,3}$/.test(raw)) continue; // skip non-numeric names
      const code2 = raw.padStart(2,'0').slice(-2);
      const mapped = DANE_DEPARTMENTS[code2];
      if(!mapped){
        console.log(`No mapping for department id=${d.id} name='${d.name}'`);
        continue;
      }

      // Look for existing department with the mapped name
      const existing = await prisma.department.findFirst({ where: { name: mapped } });
      if(existing && existing.id !== d.id){
        // Move cities to existing
        const moved = await prisma.city.updateMany({ where: { departmentId: d.id }, data: { departmentId: existing.id } });
        await prisma.department.delete({ where: { id: d.id } });
        console.log(`Merged department id=${d.id} ('${d.name}') into id=${existing.id} ('${mapped}'), moved ${moved.count} cities.`);
      }else{
        // Update the department name
        await prisma.department.update({ where: { id: d.id }, data: { name: mapped } });
        console.log(`Updated department id=${d.id} name '${d.name}' -> '${mapped}'`);
      }
    }
  }catch(e){
    console.error('Error:', e);
    process.exitCode = 1;
  }finally{
    await prisma.$disconnect();
  }
}

main();
