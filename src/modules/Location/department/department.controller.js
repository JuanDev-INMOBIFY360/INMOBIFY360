import { fetchDepartmentsByCountry } from './department.service.js';

export const getDepartmentsController = async (req, res) => {
  const { countryId } = req.query;
  if (!countryId) {
    return res.status(400).json({ message: 'countryId is required' });
  }

  const departments = await fetchDepartmentsByCountry(Number(countryId));
  res.json(departments);
};
