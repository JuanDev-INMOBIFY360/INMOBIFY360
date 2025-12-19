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
    const role = await fetchRoleById(req.params.id);
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
    const updatedRole = await modifyRole(req.params.id, req.body);
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
    const deletedRole = await removeRole(req.params.id);
    res.status(200).json(deletedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
