import {
  getAllNeighborhoods,
  getNeighborhoodByIdController,
  createNeighborhoodController,
  updateNeighborhoodController,
  deleteNeighborhoodController,
} from "./neighborhoods.controller.js";
import express from "express";
import { authorize } from "../../middleware/authorize.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", authMiddleware, authorize("neighborhoods", "READ"), getAllNeighborhoods);
router.get("/:id", authMiddleware, authorize("neighborhoods", "READ"), getNeighborhoodByIdController);
router.post("/", authMiddleware, authorize("neighborhoods", "CREATE"), createNeighborhoodController);
router.put("/:id", authMiddleware, authorize("neighborhoods", "UPDATE"), updateNeighborhoodController);
router.delete("/:id", authMiddleware, authorize("neighborhoods", "DELETE"), deleteNeighborhoodController);
export default router;
