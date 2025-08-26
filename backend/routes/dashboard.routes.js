import { Router } from 'express';
import {
  getDashboardStats,
  getUserDashboard,
  getSalesAnalytics
} from '../controllers/dashboard.controller.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/admin', verifyJWT, verifyAdmin, getDashboardStats);
router.get('/user', verifyJWT, verifyUser, getUserDashboard);
router.get('/analytics/sales', verifyJWT, verifyAdmin, getSalesAnalytics);

export default router;
