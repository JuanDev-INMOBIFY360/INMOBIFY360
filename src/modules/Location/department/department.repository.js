import prisma from '../../../config/db.js';

export const getDepartmentsByCountry = (countryId) => {
  return prisma.department.findMany({
    where: { countryId },
    orderBy: { name: 'asc' },
  });
};
