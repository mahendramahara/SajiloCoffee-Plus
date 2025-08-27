import { Router } from 'express';
import {
  getDashboardStats,
  getSalesAnalytics
} from '../controllers/dashboard.controller.js';
import {
  getOrderStats,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller.js';
import {
  getSubscriptionStats,
  getAllSubscriptions
} from '../controllers/subscription.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard', verifyJWT, verifyAdmin, getDashboardStats);
router.get('/sales', verifyJWT, verifyAdmin, getSalesAnalytics);
router.get('/orders/stats', verifyJWT, verifyAdmin, getOrderStats);
router.get('/subscriptions/stats', verifyJWT, verifyAdmin, getSubscriptionStats);

router.get('/orders', verifyJWT, verifyAdmin, getAllOrders);
router.patch('/orders/:orderId/status', verifyJWT, verifyAdmin, updateOrderStatus);

router.get('/subscriptions', verifyJWT, verifyAdmin, getAllSubscriptions);

export default router;
