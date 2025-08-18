import { body, param } from 'express-validator';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const verifyEmailValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').notEmpty().withMessage('OTP is required').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

export const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
];

export const resetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').notEmpty().withMessage('OTP is required').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const changePasswordValidation = [
  (req, res, next) => {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first."
      });
    }
    next();
  },
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

export const updateUserValidation = [
  body('name').optional().trim(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('department').optional().trim(),
  body('employeeId').optional().trim()
];

export const getUserByIdValidation = [
  param('id').isMongoId().withMessage('Valid user ID is required')
];

export const resendOTPValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
];
