import {
  getCountriesController,
  getCountryByIdController,
  createCountryController,
  updateCountryController,
  deleteCountryController,
} from "./country.controller.js";
import express from "express";

const router = express.Router();

router.get("/", getCountriesController);
router.get("/:id", getCountryByIdController);
router.post("/", createCountryController);
router.put("/:id", updateCountryController);
router.delete("/:id", deleteCountryController);

export default router;