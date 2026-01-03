import { fetchCountries } from './country.service.js';

export const getCountriesController = async (req, res) => {
  try {
    const countries = await fetchCountries();
    res.json(countries);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
