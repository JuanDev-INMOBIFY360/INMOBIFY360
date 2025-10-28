import {
  fetchAllProperties,
  fetchPropertyById,
  addProperty,
  modifyProperty,
  removeProperty,
} from "./property.service.js";
import { validationResult } from "express-validator";

export const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await fetchAllProperties();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const property = await fetchPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newProperty = await addProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedProperty = await modifyProperty(req.params.id, req.body);
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePropertyController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await removeProperty(req.params.id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
