import {
  getAllOwnersController,
  getOwnerByIdController,
  createOwnerController,
  updateOwnerController,
  deleteOwnerController,
} from './owner.controller.js';
import { Router } from 'express';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
const router = Router();
router.get('/', authMiddleware, authorize('owner', 'READ'), getAllOwnersController);
router.get('/:id', authMiddleware, authorize('owner', 'READ'), getOwnerByIdController);
router.post('/', authMiddleware, authorize('owner', 'CREATE'), createOwnerController);
router.put('/:id', authMiddleware, authorize('owner', 'UPDATE'), updateOwnerController);
router.delete('/:id', authMiddleware, authorize('owner', 'DELETE'), deleteOwnerController);
export default router;
