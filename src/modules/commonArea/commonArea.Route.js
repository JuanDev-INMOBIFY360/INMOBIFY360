import {
  getAllcommonAreasController,
  getcommonAreaByIdController,
  createcommonAreaController,
  updatecommonAreaController,
  deletecommonAreaController,
} from './commonArea.Controller.js';
import express from "express";

import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', authMiddleware, authorize('commonArea', 'READ'), getAllcommonAreasController);
router.get('/:id', authMiddleware, authorize('commonArea', 'READ'), getcommonAreaByIdController);
router.post('/', authMiddleware, authorize('commonArea', 'CREATE'), createcommonAreaController);
router.put('/:id', authMiddleware, authorize('commonArea', 'UPDATE'), updatecommonAreaController);
router.delete('/:id', authMiddleware, authorize('commonArea', 'DELETE'), deletecommonAreaController);
export default router;