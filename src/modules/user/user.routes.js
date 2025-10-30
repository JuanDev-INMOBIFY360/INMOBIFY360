import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "./user.controller.js";

import { authorize } from "../../middleware/authorize.middleware.js";
import { verifyToken } from "../../utils/jwt.js";

const router = express.Router();
router.get("/",verifyToken,authorize, getAllUsersController);
router.get("/:id",verifyToken,authorize, getUserByIdController);
router.post("/",verifyToken,authorize, createUserController);
router.put("/:id",verifyToken,authorize, updateUserController);
router.delete("/:id",verifyToken,authorize, deleteUserController);

export default router;
