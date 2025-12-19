import {
  getAllPrivilegesController,
  getPrivilegeByIdController,
  createPrivilegeController,
  updatePrivilegeController,
  deletePrivilegeController,
} from './privileges.controller.js';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();
router.get('/', authMiddleware, authorize('privileges', 'READ'), getAllPrivilegesController);
router.get('/:id', authMiddleware, authorize('privileges', 'READ'), getPrivilegeByIdController);
router.post('/', authMiddleware, authorize('privileges', 'CREATE'), createPrivilegeController);
router.put('/:id', authMiddleware, authorize('privileges', 'UPDATE'), updatePrivilegeController);
router.delete('/:id', authMiddleware, authorize('privileges', 'DELETE'), deletePrivilegeController);
export default router;
