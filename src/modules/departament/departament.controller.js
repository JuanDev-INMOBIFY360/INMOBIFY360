import {
  fetchDepartament,
  fetchDepartamentById,
  addDepartament,
  modifyDepartament,
  removeDepartament,
} from "./departament.service.js";
import { validationResult } from "express-validator";

export const getAllDepartaments = async (req, res) => {
  try {
    const departaments = await fetchDepartament();
    res.json(departaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartamentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const departament = await fetchDepartamentById(req.params.id);
    res.status(200).json(departament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createDepartamentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newDepartament = await addDepartament(req.body);
    res.status(201).json(newDepartament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateDepartamentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedDepartament = await modifyDepartament(req.params.id, req.body);
    res.status(200).json(updatedDepartament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteDepartamentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await removeDepartament(req.params.id);
    res.status(204).json({ message: "Departament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
