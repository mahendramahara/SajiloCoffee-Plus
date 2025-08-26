import { body, param, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('size')
    .isIn(['single', 'regular', 'large'])
    .withMessage('Size must be single, regular, or large'),
  body('qty')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('addons')
    .optional()
    .isArray()
    .withMessage('Addons must be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const updateCartItemValidation = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
  body('qty')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('addons')
    .optional()
    .isArray()
    .withMessage('Addons must be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const removeFromCartValidation = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
