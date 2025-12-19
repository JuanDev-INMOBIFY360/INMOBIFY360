// Script de seed para importar departamentos, ciudades y barrios desde divipola.json
// Ejecuta: node prisma/seed_divipola.js
// Requiere: divipola.json generado y Prisma configurado

import fs from 'fs';
import prisma from '../src/config/db.js';

const OUTPUT_FILE = 'prisma/divipola.json';
const API_URL = 'https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=50000';

function detectFields(sample) {
  const keys = Object.keys(sample).map((k) => k.toLowerCase());
  const deptKey = Object.keys(sample).find((k) =>
    /depart|depto|dpto|departamento/.test(k.toLowerCase())
  );
  const cityKey = Object.keys(sample).find((k) =>
    /municip|ciudad|municipio|nom_mpio/.test(k.toLowerCase())
  );
  const neighborhoodKey = Object.keys(sample).find((k) =>
    /centro|poblado|barrio|localidad|zona/.test(k.toLowerCase())
  );
  return { deptKey, cityKey, neighborhoodKey };
}

async function fetchDivipola() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (!Array.isArray(json) || json.length === 0)
    throw new Error('Respuesta vacía desde la API DIVIPOLA');

  const sample = json[0];
  let { deptKey, cityKey, neighborhoodKey } = detectFields(sample);
  // fallbacks conocidos
  if (!deptKey && Object.prototype.hasOwnProperty.call(sample, 'dpto')) deptKey = 'dpto';
  if (!cityKey && Object.prototype.hasOwnProperty.call(sample, 'nom_mpio')) cityKey = 'nom_mpio';

  const departments = {};
  for (const row of json) {
    const deptName = row[deptKey] ? String(row[deptKey]).trim() : null;
    const cityName = row[cityKey] ? String(row[cityKey]).trim() : null;
    const neighborhoodName =
      neighborhoodKey && row[neighborhoodKey] ? String(row[neighborhoodKey]).trim() : null;
    if (!deptName || !cityName) continue;
    if (!departments[deptName]) departments[deptName] = { name: deptName, cities: {} };
    if (!departments[deptName].cities[cityName])
      departments[deptName].cities[cityName] = { name: cityName, neighborhoods: [] };
    if (neighborhoodName) {
      const arr = departments[deptName].cities[cityName].neighborhoods;
      if (!arr.find((n) => n.name === neighborhoodName)) arr.push({ name: neighborhoodName });
    }
  }

  const result = {
    country: 'Colombia',
    departments: Object.values(departments).map((d) => ({
      name: d.name,
      cities: Object.values(d.cities),
    })),
  };

  // opcional: guardar el json si se quiere persistir
  if (process.env.SAVE_DIVIPOLA === '1') {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
    console.log('Archivo guardado en', OUTPUT_FILE);
  }

  return result;
}

async function getData() {
  if (fs.existsSync(OUTPUT_FILE) && !process.env.FORCE_FETCH) {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  }
  return await fetchDivipola();
}

async function main() {
  const data = await getData();

  // Inserta el país (buscar o crear)
  function normalizeName(s) {
    if (!s) return s;
    let out = String(s).trim().replace(/\s+/g, ' ');
    if (process.env.REMOVE_DIACRITICS === '1') {
      out = out.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }
    // Uppercase as requested
    return out.toUpperCase();
  }

  const countryName = normalizeName(data.country || 'COLOMBIA');
  let country = await prisma.country.findFirst({ where: { name: countryName } });
  if (!country) country = await prisma.country.create({ data: { name: countryName } });

  // counters
  let createdDepartments = 0;
  let createdCities = 0;
  let createdNeighborhoods = 0;

  // Mapping of DIVIPOLA / DANE department codes to human-readable names
  const DANE_DEPARTMENTS = {
    '05': 'ANTIOQUIA',
    '08': 'ATLÁNTICO',
    11: 'BOGOTÁ, D.C.',
    13: 'BOLÍVAR',
    15: 'BOYACÁ',
    17: 'CALDAS',
    18: 'CAQUETÁ',
    19: 'CAUCA',
    20: 'CESAR',
    23: 'CÓRDOBA',
    25: 'CUNDINAMARCA',
    27: 'CHOCÓ',
    41: 'HUILA',
    44: 'LA GUAJIRA',
    47: 'MAGDALENA',
    50: 'META',
    52: 'NARIÑO',
    54: 'NORTE DE SANTANDER',
    63: 'QUINDÍO',
    66: 'RISARALDA',
    68: 'SAN ANDRÉS Y PROVIDENCIA',
    70: 'SANTANDER',
    73: 'SUCRE',
    76: 'VALLE DEL CAUCA',
    81: 'ARAUCA',
    85: 'CASANARE',
    86: 'PUTUMAYO',
    91: 'AMAZONAS',
    94: 'GUAINÍA',
    95: 'GUAVIARE',
    97: 'VAUPÉS',
    99: 'VICHADA',
  };

  for (const dept of data.departments) {
    // Determine department name: if the source sent a numeric code, map it to the common name
    let deptNameRaw = dept.name;
    if (typeof deptNameRaw === 'number') deptNameRaw = String(deptNameRaw);
    deptNameRaw = deptNameRaw ? String(deptNameRaw).trim() : '';

    // If it looks like a numeric code, normalize to two-digit code and try mapping
    let mappedDeptName = deptNameRaw;
    if (/^\d{1,3}$/.test(deptNameRaw)) {
      const code2 = deptNameRaw.padStart(2, '0').slice(-2);
      if (DANE_DEPARTMENTS[code2]) mappedDeptName = DANE_DEPARTMENTS[code2];
    }

    const deptNameNorm = normalizeName(mappedDeptName);
    let department = await prisma.department.findFirst({
      where: { name: deptNameNorm, countryId: country.id },
    });
    if (!department) {
      department = await prisma.department.create({
        data: { name: deptNameNorm, countryId: country.id },
      });
      createdDepartments++;
    }

    for (const city of dept.cities) {
      const cityNameNorm = normalizeName(city.name);
      let cityDb = await prisma.city.findFirst({
        where: { name: cityNameNorm, departmentId: department.id },
      });
      if (!cityDb) {
        cityDb = await prisma.city.create({
          data: { name: cityNameNorm, departmentId: department.id },
        });
        createdCities++;
      }

      for (const neighborhood of city.neighborhoods) {
        const nbNameNorm = normalizeName(neighborhood.name);
        let nb = await prisma.neighborhood.findFirst({
          where: { name: nbNameNorm, cityId: cityDb.id },
        });
        if (!nb) {
          await prisma.neighborhood.create({ data: { name: nbNameNorm, cityId: cityDb.id } });
          createdNeighborhoods++;
        }
      }
    }
  }

  console.log('Seed completado.');
  console.log(
    `Resumen: Departamentos creados: ${createdDepartments}, Ciudades creadas: ${createdCities}, Barrios creados: ${createdNeighborhoods}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
