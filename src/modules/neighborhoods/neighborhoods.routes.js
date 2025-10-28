import {getAllNeighborhoods, getNeighborhoodByIdController, createNeighborhoodController, updateNeighborhoodController, deleteNeighborhoodController} from "./neighborhoods.controller.js";
import express from "express";

const router = express.Router();

router.get("/", getAllNeighborhoods);
router.get("/:id", getNeighborhoodByIdController);
router.post("/", createNeighborhoodController);
router.put("/:id", updateNeighborhoodController);
router.delete("/:id", deleteNeighborhoodController);
export default router;