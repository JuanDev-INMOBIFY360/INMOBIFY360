import { getAllDepartaments,getDepartamentController,createDepartamentController,updateDepartamentController,deleteDepartamentController } from "./departament.controller.js";
import { Router } from "express";

const router = Router();
router.get("/", getAllDepartaments);
router.get("/:id", getDepartamentController);
router.post("/", createDepartamentController);
router.put("/:id", updateDepartamentController);
router.delete("/:id", deleteDepartamentController);
export default router;
