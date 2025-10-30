import {
  getAllDepartaments,
  getDepartamentController,
  createDepartamentController,
  updateDepartamentController,
  deleteDepartamentController,
} from "./departament.controller.js";
import { Router } from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";


const router = Router();
router.get("/",authMiddleware, authorize("departament", "READ"), getAllDepartaments);
router.get("/:id",authMiddleware, authorize("departament", "READ"), authorize, getDepartamentController);
router.post("/",authMiddleware, authorize("departament", "CREATE"),authorize, createDepartamentController);
router.put("/:id", authMiddleware, authorize("departament", "DELETE"),authorize, updateDepartamentController);
router.delete("/:id", authMiddleware, authorize("departament", "UPDATE"), authorize, deleteDepartamentController);
export default router;
