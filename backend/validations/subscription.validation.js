import { body, validationResult } from 'express-validator';
import { validation } from '../utils/apiResponse.js';

export const subscribeToPlanValidation = [
  body('planId')
    .isMongoId()
    .withMessage('Invalid plan ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];

export const renewSubscriptionValidation = [
  body('planId')
    .isMongoId()
    .withMessage('Invalid plan ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, 'Validation failed', errors.array());
    }
    next();
  }
];
