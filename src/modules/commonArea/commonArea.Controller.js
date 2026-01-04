import {
  fetchAllcommonAreas,
  fetchcommonAreaById,
  createNewcommonArea,
  updateExistingcommonArea,
  deletecommonAreaById,
} from './commonArea.Service.js';
import { validationResult } from 'express-validator';
export const getAllcommonAreasController = async (req, res) => {
  try {
    const commonAreas = await fetchAllcommonAreas();
    res.status(200).json(commonAreas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getcommonAreaByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const commonArea = await fetchcommonAreaById(id);
    res.status(200).json(commonArea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createcommonAreaController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newcommonArea = await createNewcommonArea(req.body);
    res.status(201).json(newcommonArea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updatecommonAreaController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedcommonArea = await updateExistingcommonArea(id, req.body);
    res.status(200).json(updatedcommonArea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletecommonAreaController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    await deletecommonAreaById(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
