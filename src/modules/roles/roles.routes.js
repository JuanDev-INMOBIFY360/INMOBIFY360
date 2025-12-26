import {
  getAllRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from './roles.controller.js';
import { Router } from 'express';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { createRoleValidator } from '../../middleware/roles.validator.js';

const router = Router();

router.get('/', authMiddleware, authorize('role', 'READ'), getAllRolesController);
router.get('/:id', authMiddleware, authorize('role', 'READ'), getRoleByIdController);
router.post('/', authMiddleware, authorize('role', 'CREATE'), createRoleValidator, createRoleController);
router.put('/:id', authMiddleware, authorize('role', 'UPDATE'), updateRoleController);
router.delete('/:id', authMiddleware, authorize('role', 'DELETE'), deleteRoleController);
export default router;
