import { body } from 'express-validator';

export const updatePreferencesValidation = [
  body('preferredCategories')
    .optional()
    .isArray()
    .withMessage('Preferred categories must be an array'),
  
  body('preferredSizes')
    .optional()
    .isArray()
    .withMessage('Preferred sizes must be an array'),
  
  body('preferredAddons')
    .optional()
    .isArray()
    .withMessage('Preferred addons must be an array'),
  
  body('coffeeStrength')
    .optional()
    .isIn(['light', 'medium', 'strong'])
    .withMessage('Coffee strength must be light, medium, or strong'),
  
  body('sweetness')
    .optional()
    .isIn(['none', 'light', 'medium', 'sweet'])
    .withMessage('Sweetness must be none, light, medium, or sweet'),
  
  body('temperature')
    .optional()
    .isIn(['hot', 'cold', 'iced'])
    .withMessage('Temperature must be hot, cold, or iced'),
  
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  
  body('dislikes')
    .optional()
    .isArray()
    .withMessage('Dislikes must be an array'),
  
  body('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Max price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number')
];
