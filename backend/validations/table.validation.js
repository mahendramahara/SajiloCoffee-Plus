import { body, param, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const createTableValidation = [
  body('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacity must be between 1 and 20'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const updateTableValidation = [
  param('tableId')
    .isMongoId()
    .withMessage('Invalid table ID'),
  body('tableNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacity must be between 1 and 20'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'reserved'])
    .withMessage('Status must be available, occupied, or reserved'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const getTableByIdValidation = [
  param('tableId')
    .isMongoId()
    .withMessage('Invalid table ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const getTableByNumberValidation = [
  param('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
