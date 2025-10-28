import { getAllOwnersController,getOwnerByIdController,createOwnerController,updateOwnerController,deleteOwnerController } from "./owner.controller.js";
import { Router } from "express";

const router = Router();
router.get("/", getAllOwnersController);
router.get("/:id", getOwnerByIdController);
router.post("/", createOwnerController);
router.put("/:id", updateOwnerController);
router.delete("/:id", deleteOwnerController);
export default router;