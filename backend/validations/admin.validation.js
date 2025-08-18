import { body } from 'express-validator';

export const createAdminValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Role must be one of: admin, manager, staff'),

  body('department')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s&-]+$/)
    .withMessage('Department can only contain letters, spaces, ampersands, and hyphens'),

  body('employeeId')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Employee ID can only contain letters, numbers, hyphens, and underscores'),

  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object'),

  body('permissions.products')
    .optional()
    .isObject()
    .withMessage('Products permissions must be an object'),

  body('permissions.orders')
    .optional()
    .isObject()
    .withMessage('Orders permissions must be an object'),

  body('permissions.users')
    .optional()
    .isObject()
    .withMessage('Users permissions must be an object'),

  body('permissions.subscriptions')
    .optional()
    .isObject()
    .withMessage('Subscriptions permissions must be an object'),

  body('permissions.analytics')
    .optional()
    .isObject()
    .withMessage('Analytics permissions must be an object'),

  body('permissions.settings')
    .optional()
    .isObject()
    .withMessage('Settings permissions must be an object'),

  body('permissions.admins')
    .optional()
    .isObject()
    .withMessage('Admins permissions must be an object')
];

export const updateAdminValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Role must be one of: admin, manager, staff'),

  body('department')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s&-]+$/)
    .withMessage('Department can only contain letters, spaces, ampersands, and hyphens'),

  body('employeeId')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Employee ID can only contain letters, numbers, hyphens, and underscores'),

  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

export const loginAdminValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];
