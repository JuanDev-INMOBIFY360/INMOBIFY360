import prisma from '../../config/db.js';

export const getCountries = async () => {
  return await prisma.country.findMany();
};

export const getCountryById = async (id) => {
  return await prisma.country.findUnique({
    where: { id: id },
  });
};

export const createCountry = async (data) => {
  return await prisma.country.create({
    data: data,
  });
};

export const updateCountry = async (id, data) => {
  return await prisma.country.update({
    where: { id: id },
    data: data,
  });
};

export const deleteCountry = async (id) => {
  return await prisma.country.delete({
    where: { id: id },
  });
};
