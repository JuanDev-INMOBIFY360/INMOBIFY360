import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "./user.controller.js";

import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";


const router = express.Router();
router.get("/",authMiddleware,authorize, getAllUsersController);
router.get("/:id",authMiddleware,authorize, getUserByIdController);
router.post("/",authMiddleware,authorize, createUserController);
router.put("/:id",authMiddleware,authorize, updateUserController);
router.delete("/:id",authMiddleware,authorize, deleteUserController);

export default router;
