import {
  fetchAllNearbyPlaces,
  fetchNearbyPlaceById,
  createNewNearbyPlace,
  updateExistingNearbyPlace,
  deleteNearbyPlaceById,
} from './nearby.Service.js';
import { validationResult } from 'express-validator';

export const getAllNearbyPlacesController = async (req, res) => {
  try {
    const nearbyPlaces = await fetchAllNearbyPlaces();
    res.status(200).json(nearbyPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNearbyPlaceByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const nearbyPlace = await fetchNearbyPlaceById(id);
    res.status(200).json(nearbyPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createNearbyPlaceController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newNearbyPlace = await createNewNearbyPlace(req.body);
    res.status(201).json(newNearbyPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateNearbyPlaceController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedNearbyPlace = await updateExistingNearbyPlace(id, req.body);
    res.status(200).json(updatedNearbyPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteNearbyPlaceController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    await deleteNearbyPlaceById(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
