import {
  getTypePropertiesController,
  getTypePropertyByIdController,
  createTypePropertyController,
  updateTypePropertyController,
  deleteTypePropertyController,
} from "./type.controller.js";
import { Router } from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
router.get("/",authMiddleware, authorize("type", "READ"), getTypePropertiesController);
router.get("/:id",authMiddleware, authorize("type", "READ"), getTypePropertyByIdController);
router.post("/",authMiddleware, authorize("type", "READ"), createTypePropertyController);
router.put("/:id",authMiddleware, authorize("type", "READ"), updateTypePropertyController);
router.delete("/:id",authMiddleware, authorize("type", "READ"), deleteTypePropertyController);

export default router;
