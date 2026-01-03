import {
  getAllPermissionsController,
  getPermissionByIdController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from './permissions.controller.js';
import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
const router = express.Router();

router.get('/', authMiddleware, getAllPermissionsController);
router.get('/:id', authMiddleware, getPermissionByIdController);
router.post('/', authMiddleware, createPermissionController);
router.put('/:id', authMiddleware, updatePermissionController);
router.delete('/:id', authMiddleware, deletePermissionController);

export default router;
