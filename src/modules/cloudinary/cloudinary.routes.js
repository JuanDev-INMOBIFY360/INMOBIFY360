import { Router } from 'express';
import { getSignature, destroyImage } from './cloudinary.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Devuelve signature para signed direct upload (protegido)
router.get('/sign', authMiddleware, getSignature);

// Eliminar imagen por public_id (protegido)
router.delete('/destroy', authMiddleware, destroyImage);

export default router;
