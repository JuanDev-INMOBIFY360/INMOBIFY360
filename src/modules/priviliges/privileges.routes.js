import {
  getAllPrivilegesController,
  getPrivilegeByIdController,
  createPrivilegeController,
  updatePrivilegeController,
  deletePrivilegeController,
} from "./privileges.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();
router.get("/", authMiddleware, getAllPrivilegesController);
router.get("/:id", authMiddleware, getPrivilegeByIdController);
router.post("/", authMiddleware, createPrivilegeController);
router.put("/:id", authMiddleware, updatePrivilegeController);
router.delete("/:id", authMiddleware, deletePrivilegeController);
export default router;
