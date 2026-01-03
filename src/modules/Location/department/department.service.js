import { getDepartmentsByCountry } from './department.repository.js';

export const fetchDepartmentsByCountry = (countryId) =>
  getDepartmentsByCountry(countryId);
