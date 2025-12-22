import { fetchAllRoles, fetchRoleById, addRole, modifyRole, removeRole } from './roles.service.js';
import { validationResult } from 'express-validator';

export const getAllRolesController = async (req, res) => {
  try {
    const roles = await fetchAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
export const getRoleByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const role = await fetchRoleById(id);
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoleController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newRole = await addRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateRoleController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedRole = await modifyRole(id, req.body);
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteRoleController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const deletedRole = await removeRole(id);
    res.status(200).json(deletedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
