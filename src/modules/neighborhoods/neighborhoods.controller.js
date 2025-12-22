import {
  fetchNeighborhoods,
  fetchNeighborhoodById,
  addNeighborhood,
  modifyNeighborhood,
  removeNeighborhood,
} from './neighborhoods.service.js';
import { validationResult } from 'express-validator';

export const getAllNeighborhoods = async (req, res) => {
  try {
    const neighborhoods = await fetchNeighborhoods();
    res.status(200).json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNeighborhoodByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const neighborhood = await fetchNeighborhoodById(id);
    res.status(200).json(neighborhood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNeighborhoodController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newNeighborhood = await addNeighborhood(req.body);
    res.status(201).json(newNeighborhood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateNeighborhoodController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedNeighborhood = await modifyNeighborhood(id, req.body);
    res.status(200).json(updatedNeighborhood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteNeighborhoodController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    await removeNeighborhood(id);
    res.status(204).json({ message: 'Neighborhood deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
