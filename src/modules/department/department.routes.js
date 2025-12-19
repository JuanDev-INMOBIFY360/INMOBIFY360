import {
  getAllDepartments,
  getDepartmentController,
  createDepartmentController,
  updateDepartmentController,
  deleteDepartmentController,
} from './department.controller.js';
import { Router } from 'express';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
router.get('/', getAllDepartments);
router.get(
  '/:id',
  authMiddleware,
  authorize('department', 'READ'),
  authorize,
  getDepartmentController
);
router.post(
  '/',
  authMiddleware,
  authorize('department', 'CREATE'),
  authorize,
  createDepartmentController
);
router.put(
  '/:id',
  authMiddleware,
  authorize('department', 'DELETE'),
  authorize,
  updateDepartmentController
);
router.delete(
  '/:id',
  authMiddleware,
  authorize('department', 'UPDATE'),
  authorize,
  deleteDepartmentController
);
export default router;
