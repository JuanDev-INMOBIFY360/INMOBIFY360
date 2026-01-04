import { Router } from 'express';
import {
  getAllPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
  uploadImagesController,
  deleteImageController,
  setPrimaryImageController,
} from './property.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/authorize.middleware.js';
import {
  createPropertyValidator,
  updatePropertyValidator,
  getPropertyByIdValidator,
  deletePropertyValidator,
  uploadImagesValidator,
  deleteImageValidator,
  setPrimaryImageValidator,
} from '../../middleware/property.validator.js';

const router = Router();

// Rutas CRUD básicas
router.get(
  '/',
  authMiddleware,
  authorize('property', 'READ'),
  getAllPropertiesController
);

router.get(
  '/:id',
  authMiddleware,
  authorize('property', 'READ'),
  getPropertyByIdValidator,
  getPropertyByIdController
);

router.post(
  '/',
  authMiddleware,
  authorize('property', 'CREATE'),
  createPropertyValidator,
  createPropertyController
);

router.put(
  '/:id',
  authMiddleware,
  authorize('property', 'UPDATE'),
  updatePropertyValidator,
  updatePropertyController
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('property', 'DELETE'),
  deletePropertyValidator,
  deletePropertyController
);

// Rutas para gestión de imágenes
router.post(
  '/:id/images',
  authMiddleware,
  authorize('property', 'UPDATE'),
  uploadImagesValidator,
  uploadImagesController
);

router.delete(
  '/:propertyId/images/:imageId',
  authMiddleware,
  authorize('property', 'UPDATE'),
  deleteImageValidator,
  deleteImageController
);

router.patch(
  '/:propertyId/images/:imageId/primary',
  authMiddleware,
  authorize('property', 'UPDATE'),
  setPrimaryImageValidator,
  setPrimaryImageController
);

export default router;