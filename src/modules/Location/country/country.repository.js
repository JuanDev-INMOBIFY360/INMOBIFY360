import prisma from '../../../config/db.js';

export const getCountries = () => {
  return prisma.country.findMany({
    orderBy: { name: 'asc' },
  });
};
