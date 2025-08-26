import { body, param, query, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const getProductsValidation = [
  query('category')
    .optional()
    .isIn(['espresso', 'milk', 'cold', 'specialty', 'tea'])
    .withMessage('Invalid category'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be a boolean'),
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'ratingAverage', 'ratingCount', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const getProductByIdValidation = [
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

export const getProductBySlugValidation = [
  param('slug')
    .notEmpty()
    .withMessage('Product slug is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const rateProductValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Feedback must be a string with maximum 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
