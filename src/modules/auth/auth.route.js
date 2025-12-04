import {
  LoginController,
  getProfile,
  updateProfile,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Router } from "express";

import { authorize } from "../../middleware/authorize.middleware.js";
const router = Router();

router.post("/login", LoginController);
router.get("/profile", authMiddleware, authorize("user", "READ"), getProfile);
router.put("/profile", authMiddleware, authorize("user", "UPDATE"), updateProfile);

export default router;
