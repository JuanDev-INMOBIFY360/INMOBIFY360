import { body, param } from 'express-validator';

export const createPropertyValidator = [
  body('titulo')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isString()
    .withMessage('El título debe ser una cadena')
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),

  body('descripcion')
    .optional()
    .isString()
    .withMessage('La descripción debe ser una cadena'),

  body('operacion')
    .notEmpty()
    .withMessage('El tipo de operación es obligatorio')
    .isIn(['SALE', 'RENT'])
    .withMessage('La operación debe ser SALE o RENT'),

  body('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),

  body('moneda')
    .optional()
    .isIn(['COP', 'USD', 'EUR'])
    .withMessage('Moneda no válida'),

  body('habitaciones')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Las habitaciones deben ser un número entero positivo'),

  body('banos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los baños deben ser un número entero positivo'),

  body('parqueaderos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los parqueaderos deben ser un número entero positivo'),

  body('areaConstruida')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El área construida debe ser un número positivo'),

  body('ciudad')
    .notEmpty()
    .withMessage('La ciudad es obligatoria')
    .isString(),

  body('barrio')
    .optional()
    .isString(),

  body('direccion')
    .notEmpty()
    .withMessage('La dirección es obligatoria')
    .isString(),

  body('countryId')
    .notEmpty()
    .withMessage('El país es obligatorio')
    .isInt(),

  body('departmentId')
    .notEmpty()
    .withMessage('El departamento es obligatorio')
    .isInt(),

  body('ownerId')
    .notEmpty()
    .withMessage('El propietario es obligatorio')
    .isInt(),

  body('typePropertyId')
    .notEmpty()
    .withMessage('El tipo de propiedad es obligatorio')
    .isInt(),

  // ✅ ZONAS COMUNES
  body('commonAreaIds')
    .optional()
    .isArray()
    .withMessage('commonAreaIds debe ser un arreglo'),

  body('commonAreaIds.*')
    .isInt()
    .withMessage('Cada commonAreaId debe ser un número entero'),

  // Imágenes
  body('images')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Máximo 20 imágenes permitidas'),

  body('images.*.base64')
    .optional()
    .isString()
    .withMessage('La imagen debe estar en formato base64'),

  body('images.*.isPrimary')
    .optional()
    .isBoolean(),

  body('images.*.order')
    .optional()
    .isInt({ min: 0 }),
];


export const updatePropertyValidator = [
  param('id').isInt().withMessage('ID inválido'),

  body('titulo')
    .optional()
    .isString()
    .isLength({ min: 3, max: 200 }),

  body('descripcion')
    .optional()
    .isString(),

  body('operacion')
    .optional()
    .isIn(['SALE', 'RENT']),

  body('precio')
    .optional()
    .isFloat({ min: 0 }),

  body('moneda')
    .optional()
    .isIn(['COP', 'USD', 'EUR']),

  body('habitaciones')
    .optional()
    .isInt({ min: 0 }),

  body('banos')
    .optional()
    .isInt({ min: 0 }),

  body('parqueaderos')
    .optional()
    .isInt({ min: 0 }),

  body('areaConstruida')
    .optional()
    .isFloat({ min: 0 }),

  body('ciudad')
    .optional()
    .isString(),

  body('barrio')
    .optional()
    .isString(),

  body('direccion')
    .optional()
    .isString(),

  body('estado')
    .optional()
    .isIn(['AVAILABLE', 'SOLD', 'RENTED', 'INACTIVE']),

  body('publicada')
    .optional()
    .isBoolean(),

  body('destacada')
    .optional()
    .isBoolean(),

  body('countryId')
    .optional()
    .isInt(),

  body('departmentId')
    .optional()
    .isInt(),

  body('ownerId')
    .optional()
    .isInt(),

  body('typePropertyId')
    .optional()
    .isInt(),

  // ✅ ZONAS COMUNES
  body('commonAreaIds')
    .optional()
    .isArray(),

  body('commonAreaIds.*')
    .isInt(),
];


export const getPropertyByIdValidator = [param('id').isInt().withMessage('ID inválido')];

export const deletePropertyValidator = [param('id').isInt().withMessage('ID inválido')];

export const uploadImagesValidator = [
  param('id').isInt().withMessage('ID de propiedad inválido'),

  body('images')
    .isArray({ min: 1, max: 20 })
    .withMessage('Debe proporcionar entre 1 y 20 imágenes'),

  body('images.*.base64')
    .notEmpty()
    .withMessage('La imagen en base64 es obligatoria')
    .isString()
    .withMessage('La imagen debe estar en formato base64'),

  body('images.*.isPrimary').optional().isBoolean().withMessage('isPrimary debe ser un booleano'),

  body('images.*.order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El orden debe ser un número entero positivo'),
];

export const deleteImageValidator = [
  param('propertyId').isInt().withMessage('ID de propiedad inválido'),
  param('imageId').isInt().withMessage('ID de imagen inválido'),
];

export const setPrimaryImageValidator = [
  param('propertyId').isInt().withMessage('ID de propiedad inválido'),
  param('imageId').isInt().withMessage('ID de imagen inválido'),
];
