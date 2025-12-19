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
    const neighborhood = await fetchNeighborhoodById(req.params.id);
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
    const updatedNeighborhood = await modifyNeighborhood(req.params.id, req.body);
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
    await removeNeighborhood(req.params.id);
    res.status(204).json({ message: 'Neighborhood deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
