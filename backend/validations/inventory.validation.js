import { body, param, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const createProductValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('slug')
    .notEmpty()
    .withMessage('Product slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn(['espresso', 'milk', 'cold', 'specialty', 'tea'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image')
    .notEmpty()
    .withMessage('Product image is required'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const updateProductValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .optional()
    .isIn(['espresso', 'milk', 'cold', 'specialty', 'tea'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const deleteProductValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
