import { body, param, query, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const createOrderValidation = [
  body('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Valid table number is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.size')
    .isIn(['single', 'regular', 'large'])
    .withMessage('Size must be single, regular, or large'),
  body('items.*.qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.addons')
    .optional()
    .isArray()
    .withMessage('Addons must be an array'),
  body('subscriptionPerkApplied')
    .optional()
    .isBoolean()
    .withMessage('Subscription perk applied must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const getOrdersValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'preparing', 'served', 'cancelled'])
    .withMessage('Invalid order status'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
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

export const getOrderByIdValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Invalid order ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const updateOrderStatusValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Invalid order ID'),
  body('status')
    .isIn(['pending', 'preparing', 'served', 'cancelled'])
    .withMessage('Invalid order status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
