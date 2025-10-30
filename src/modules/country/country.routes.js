import {
  getCountriesController,
  getCountryByIdController,
  createCountryController,
  updateCountryController,
  deleteCountryController,
} from "./country.controller.js";
import express from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",authMiddleware, authorize("country", "READ"), getCountriesController);
router.get("/:id",authMiddleware, authorize("country", "READ"), getCountryByIdController);
router.post("/",authMiddleware, authorize("country", "CREATE"), createCountryController);
router.put("/:id",authMiddleware, authorize("country", "UPDATE"), updateCountryController);
router.delete("/:id",authMiddleware, authorize("country", "DELETE"), deleteCountryController);

export default router;