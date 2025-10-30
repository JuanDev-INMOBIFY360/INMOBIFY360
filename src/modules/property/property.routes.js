import { Router } from "express";
import {
  getAllPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from "./property.controller.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { verifyToken } from "../../utils/jwt.js";


const router = Router();

router.get("/",verifyToken,authorize, getAllPropertiesController);
router.get("/:id", verifyToken,authorize,getPropertyByIdController);
router.post("/",verifyToken,authorize, createPropertyController);
router.put("/:id",verifyToken,authorize, updatePropertyController);
router.delete("/:id",verifyToken,authorize, deletePropertyController);

export default router;
