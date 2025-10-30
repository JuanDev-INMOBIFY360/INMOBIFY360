import { getAllRolesController,getRoleByIdController,createRoleController,updateRoleController,deleteRoleController } from "./roles.controller.js";
import { Router } from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/",authMiddleware, authorize("role", "READ"), getAllRolesController);
router.get("/:id",authMiddleware, authorize("role", "READ"), getRoleByIdController);
router.post("/",authMiddleware, authorize("role", "READ"), createRoleController);
router.put("/:id",authMiddleware, authorize("role", "READ"), updateRoleController);
router.delete("/:id",authMiddleware, authorize("role", "READ"), deleteRoleController);
export default router;