import { Router } from 'express';
import multer from 'multer';
import {
  getAllPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from './property.controller.js';
import { uploadPropertyImageController } from './property.upload.controller.js';
import { addImageMetadataController } from './property.upload.controller.js';
import { removeImageController } from './property.upload.controller.js';
import { authorize } from '../../middleware/authorize.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// multer in memory with validation (type and size)
const storage = multer.memoryStorage();
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'), false);
  },
});

router.get('/', getAllPropertiesController);
router.get('/:id', authMiddleware, authorize('property', 'READ'), getPropertyByIdController);
router.post(
  '/',
  authMiddleware,
  authorize('property', 'CREATE'),
  upload.array('imagenes'),
  createPropertyController
);
router.put(
  '/:id',
  authMiddleware,
  authorize('property', 'UPDATE'),
  upload.array('imagenes'),
  updatePropertyController
);
router.delete('/:id', authMiddleware, authorize('property', 'DELETE'), deletePropertyController);

// Upload image for a property
router.post(
  '/:id/images',
  authMiddleware,
  authorize('property', 'UPDATE'),
  upload.single('image'),
  uploadPropertyImageController
);

// Agregar metadata de imagen (cuando se sube directo a Cloudinary desde el cliente)
router.post(
  '/:id/images/meta',
  authMiddleware,
  authorize('property', 'UPDATE'),
  addImageMetadataController
);

// Eliminar imagen de propiedad
router.delete(
  '/:id/images',
  authMiddleware,
  authorize('property', 'UPDATE'),
  removeImageController
);

export default router;
