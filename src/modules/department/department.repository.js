import prisma from '../../config/db.js';

export const getDepartments = async () => {
  return await prisma.department.findMany({
    include: { country: true, cities: true },
  });
};

export const getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: { id },
    include: { country: true, cities: true },
  });
};

export const createDepartment = async (data) => {
  return await prisma.department.create({ data });
};

export const updateDepartment = async (id, data) => {
  return await prisma.department.update({
    where: { id },
    data,
  });
};

export const deleteDepartment = async (id) => {
  return await prisma.department.delete({ where: { id } });
};
