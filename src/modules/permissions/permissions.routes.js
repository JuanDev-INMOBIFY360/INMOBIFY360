import {
  getAllPermissionsController,
  getPermissionByIdController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "./permissions.controller.js";
import express from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.get("/",authMiddleware, authorize("owner", "READ"), getAllPermissionsController);
router.get("/:id",authMiddleware, authorize("owner", "READ"), getPermissionByIdController);
router.post("/",authMiddleware, authorize("owner", "CREATE"), createPermissionController);
router.put("/:id",authMiddleware, authorize("owner", "UPDATE"), updatePermissionController);
router.delete("/:id",authMiddleware, authorize("owner", "DELETE"), deletePermissionController);

export default router;
