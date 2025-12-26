import { body } from 'express-validator';

export const createRoleValidator = [
  body('name')
    .notEmpty().withMessage('name es obligatorio')
    .isString(),

  body('description')
    .optional()
    .isString(),

  body('permissions')
    .isArray({ min: 1 })
    .withMessage('permissions debe ser un array'),

  body('permissions.*.permissionId')
    .isInt()
    .withMessage('permissionId debe ser entero'),

  body('permissions.*.privileges')
    .isArray({ min: 1 })
    .withMessage('privileges debe ser un array'),

  body('permissions.*.privileges.*')
    .isInt()
    .withMessage('privilegeId debe ser entero'),
];
