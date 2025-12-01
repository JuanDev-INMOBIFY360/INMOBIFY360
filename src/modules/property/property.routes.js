import { Router } from "express";
import {
  getAllPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from "./property.controller.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllPropertiesController);
router.get("/:id", authMiddleware, authorize("property", "READ"), getPropertyByIdController);
router.post("/", authMiddleware, authorize("property", "CREATE"), createPropertyController);
router.put("/:id", authMiddleware, authorize("property", "UPDATE"), updatePropertyController);
router.delete("/:id", authMiddleware, authorize("property", "DELETE"), deletePropertyController);

export default router;