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

router.get("/", authMiddleware, authorize("user", "READ"), getAllUsersController);
router.get("/:id", authMiddleware, authorize("user", "READ"), getUserByIdController);
router.post("/", authMiddleware, authorize("user", "CREATE"), createUserController);
router.put("/:id", authMiddleware, authorize("user", "UPDATE"), updateUserController);
router.delete("/:id", authMiddleware, authorize("user", "DELETE"), deleteUserController);

export default router;