import { getCities, getCityById, createCity, updateCity, deleteCity } from './city.repository.js';

export const fetchCities = async () => {
  return await getCities();
};
export const fetchCityById = async (id) => {
  return await getCityById(id);
};
export const addCity = async (data) => {
  return await createCity(data);
};
export const modifyCity = async (id, data) => {
  return await updateCity(id, data);
};
export const removeCity = async (id) => {
  return await deleteCity(id);
};
