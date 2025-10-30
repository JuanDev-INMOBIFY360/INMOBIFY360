import {
  getAllCities,
  getCityByIdController,
  createCityController,
  updateCityController,
  deleteCityController,
} from "./city.controller.js";

import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authMiddleware, authorize("city", "READ"), getAllCities);
router.get("/:id", authMiddleware, authorize("city", "READ"), getCityByIdController);
router.post("/", authMiddleware, authorize("city", "CREATE"), createCityController);
router.put("/:id", authMiddleware, authorize("city", "UPDATE"), updateCityController);
router.delete("/:id", authMiddleware, authorize("city", "DELETE"), deleteCityController);

export default router;
