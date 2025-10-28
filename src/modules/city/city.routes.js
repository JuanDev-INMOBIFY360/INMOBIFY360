import {
  getAllCities,
  getCityByIdController,
  createCityController,
  updateCityController,
  deleteCityController,
} from "./city.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", getAllCities);
router.get("/:id", getCityByIdController);
router.post("/", createCityController);
router.put("/:id", updateCityController);
router.delete("/:id", deleteCityController);
export default router;
