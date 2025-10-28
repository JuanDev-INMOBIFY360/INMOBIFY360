import { Router } from "express";
import {
  getAllPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from "./property.controller.js";

const router = Router();

router.get("/", getAllPropertiesController);
router.get("/:id", getPropertyByIdController);
router.post("/", createPropertyController);
router.put("/:id", updatePropertyController);
router.delete("/:id", deletePropertyController);

export default router;
