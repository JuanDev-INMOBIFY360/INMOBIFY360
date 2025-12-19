import {
  getAllPermissionsController,
  getPermissionByIdController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from './permissions.controller.js';
import { authorize } from '../../middleware/authorize.middleware.js';
import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
const router = express.Router();

router.get('/', authMiddleware, authorize('permissions', 'READ'), getAllPermissionsController);
router.get('/:id', authMiddleware, authorize('permissions', 'READ'), getPermissionByIdController);
router.post('/', authMiddleware, authorize('permissions', 'CREATE'), createPermissionController);
router.put('/:id', authMiddleware, authorize('permissions', 'UPDATE'), updatePermissionController);
router.delete(
  '/:id',
  authMiddleware,
  authorize('permissions', 'DELETE'),
  deletePermissionController
);

export default router;
