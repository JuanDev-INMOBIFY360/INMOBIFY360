import {
  fetchAllPrivileges,
  fetchPrivilegeById,
  addPrivilege,
  modifyPrivilege,
  removePrivilege,
} from './privileges.service.js';
import { validationResult } from 'express-validator';

export const getAllPrivilegesController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const privileges = await fetchAllPrivileges();
    res.status(200).json(privileges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrivilegeByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const privilege = await fetchPrivilegeById(req.params.id);
    res.status(200).json(privilege);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrivilegeController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newPrivilege = await addPrivilege(req.body);
    res.status(201).json(newPrivilege);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePrivilegeController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedPrivilege = await modifyPrivilege(req.params.id, req.body);
    res.status(200).json(updatedPrivilege);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePrivilegeController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await removePrivilege(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
