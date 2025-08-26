import { Router } from 'express';
import {
  getRecommendations,
  refreshRecommendations
} from '../controllers/recommendation.controller.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyJWT, verifyUser, getRecommendations);
router.post('/refresh', verifyJWT, verifyUser, refreshRecommendations);

export default router;
