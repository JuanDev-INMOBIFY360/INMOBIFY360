import { fetchCities, fetchCityById, addCity, modifyCity, removeCity } from './city.service.js';
import { validationResult } from 'express-validator';

export const getAllCities = async (req, res) => {
  try {
    const cities = await fetchCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCityByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const city = await fetchCityById(req.params.id);
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createCityController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newCity = await addCity(req.body);
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateCityController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedCity = await modifyCity(req.params.id, req.body);
    res.status(200).json(updatedCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteCityController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await removeCity(req.params.id);
    res.status(204).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
