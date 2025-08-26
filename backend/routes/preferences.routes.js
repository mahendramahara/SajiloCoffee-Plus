import express from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences
} from '../controllers/preferences.controller.js';
import { updatePreferencesValidation } from '../validations/preferences.validation.js';

const router = express.Router();

router.get('/preferences', verifyJWT, getUserPreferences);
router.put('/preferences', verifyJWT, updatePreferencesValidation, updateUserPreferences);
router.post('/preferences/reset', verifyJWT, resetUserPreferences);

export default router;
