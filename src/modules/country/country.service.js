import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} from './country.repository.js';

export const fetchCountries = async () => {
  return await getCountries();
};
export const fetchCountryById = async (id) => {
  return await getCountryById(id);
};
export const addCountry = async (data) => {
  return await createCountry(data);
};
export const modifyCountry = async (id, data) => {
  return await updateCountry(id, data);
};
export const removeCountry = async (id) => {
  return await deleteCountry(id);
};
