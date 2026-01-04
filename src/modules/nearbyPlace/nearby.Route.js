import {
  getAllNearbyPlacesController,
  getNearbyPlaceByIdController,
  createNearbyPlaceController,
  updateNearbyPlaceController,
  deleteNearbyPlaceController,
} from './nearby.Controller.js';
import express from "express";

import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', authMiddleware, authorize('nearbyPlace', 'READ'), getAllNearbyPlacesController);
router.get('/:id', authMiddleware, authorize('nearbyPlace', 'READ'), getNearbyPlaceByIdController);
router.post('/', authMiddleware, authorize('nearbyPlace', 'CREATE'), createNearbyPlaceController);
router.put('/:id', authMiddleware, authorize('nearbyPlace', 'UPDATE'), updateNearbyPlaceController);
router.delete('/:id', authMiddleware, authorize('nearbyPlace', 'DELETE'), deleteNearbyPlaceController);
export default router;