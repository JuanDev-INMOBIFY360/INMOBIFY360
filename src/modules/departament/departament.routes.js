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
router.get("/", getAllDepartaments);
router.get("/:id",authMiddleware, authorize("department", "READ"), authorize, getDepartamentController);
router.post("/",authMiddleware, authorize("department", "CREATE"),authorize, createDepartamentController);
router.put("/:id", authMiddleware, authorize("department", "DELETE"),authorize, updateDepartamentController);
router.delete("/:id", authMiddleware, authorize("department", "UPDATE"), authorize, deleteDepartamentController);
export default router;
