import {
  fetchAllPermissions,
  fetchPermissionById,
  addPermission,
  modifyPermission,
  removePermission,
} from "./permissions.service.js";
import { validationResult } from "express-validator";

export const getAllPermissionsController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const permissions = await fetchAllPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermissionByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const permission = await fetchPermissionById(req.params.id);
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPermissionController = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try {
    const newPermission = await addPermission(req.body);
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePermissionController = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const updatedPermission = await modifyPermission(req.params.id, req.body);
    res.status(200).json(updatedPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePermissionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    await removePermission(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
