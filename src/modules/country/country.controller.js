import {
  fetchCountries,
  fetchCountryById,
  addCountry,
  modifyCountry,
  removeCountry,
} from './country.service.js';
import { validationResult } from 'express-validator';

export const getCountriesController = async (req, res) => {
  try {
    const countries = await fetchCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCountryByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const country = await fetchCountryById(id);
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCountryController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newCountry = await addCountry(req.body);
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateCountryController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedCountry = await modifyCountry(id, req.body);
    res.status(200).json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCountryController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const Removecountry = await removeCountry(id);
    res.status(204).json(Removecountry, { message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
