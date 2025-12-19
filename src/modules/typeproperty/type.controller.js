import {
  fetchTypeProperties,
  fetchTypePropertyById,
  addTypeProperty,
  modifyTypeProperty,
  removeTypeProperty,
} from './type.service.js';
import { validationResult } from 'express-validator';

export const getTypePropertiesController = async (req, res) => {
  try {
    const typeProperties = await fetchTypeProperties();
    res.status(200).json(typeProperties);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTypePropertyByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const typeProperty = await fetchTypePropertyById(id);
    res.status(200).json(typeProperty);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTypePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const data = req.body;
    const newTypeProperty = await addTypeProperty(data);
    res.status(201).json(newTypeProperty);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const updateTypePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedTypeProperty = await modifyTypeProperty(id, data);
    res.status(200).json(updatedTypeProperty);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const deleteTypePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await removeTypeProperty(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
