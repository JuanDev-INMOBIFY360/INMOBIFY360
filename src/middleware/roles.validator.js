import { body } from 'express-validator';

export const createRoleValidator = [
  body('name')
    .notEmpty().withMessage('name es obligatorio')
    .isString(),

  body('description')
    .optional()
    .isString(),

  body('privileges')
    .isArray({ min: 1 })
    .withMessage('privileges debe ser un array'),

  body('privileges.*')
    .isInt()
    .withMessage('privilegeId debe ser entero'),
];
