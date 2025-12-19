import {
  getTypePropertiesController,
  getTypePropertyByIdController,
  createTypePropertyController,
  updateTypePropertyController,
  deleteTypePropertyController,
} from './type.controller.js';
import { Router } from 'express';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();
router.get('/', authMiddleware, authorize('typeProperty', 'READ'), getTypePropertiesController);
router.get(
  '/:id',
  authMiddleware,
  authorize('typeProperty', 'READ'),
  getTypePropertyByIdController
);
router.post('/', authMiddleware, authorize('typeProperty', 'CREATE'), createTypePropertyController);
router.put(
  '/:id',
  authMiddleware,
  authorize('typeProperty', 'UPDATE'),
  updateTypePropertyController
);
router.delete(
  '/:id',
  authMiddleware,
  authorize('typeProperty', 'DELETE'),
  deleteTypePropertyController
);

export default router;
