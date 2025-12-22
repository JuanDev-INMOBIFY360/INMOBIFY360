import { parse } from 'dotenv';
import {
  fetchOwners,
  fetchOwnerById,
  addOwner,
  modifyOwner,
  removeOwner,
} from './owner.service.js';
import { validationResult } from 'express-validator';

export const getAllOwnersController = async (req, res) => {
  try {
    const owners = await fetchOwners();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOwnerByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const owner = await fetchOwnerById(id);
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOwnerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newOwner = await addOwner(req.body);
    res.status(201).json(newOwner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOwnerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedOwner = await modifyOwner(id, req.body);
    res.status(200).json(updatedOwner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOwnerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const removeowener = await removeOwner(id);
    res.status(204).json(removeowener, { message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
