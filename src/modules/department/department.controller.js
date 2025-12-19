import {
  fetchDepartment,
  fetchDepartmentById,
  addDepartment,
  modifyDepartment,
  removeDepartment,
} from './department.service.js';
import { validationResult } from 'express-validator';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await fetchDepartment();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const department = await fetchDepartmentById(req.params.id);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createDepartmentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newDepartment = await addDepartment(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateDepartmentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedDepartment = await modifyDepartment(req.params.id, req.body);
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteDepartmentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await removeDepartment(req.params.id);
    res.status(204).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
