import { Router } from 'express';
import {
  getSubscriptionPlans,
  subscribeToPlan,
  getMySubscription,
  cancelSubscription,
  renewSubscription,
  getAllSubscriptions,
  getSubscriptionStats
} from '../controllers/subscription.controller.js';
import {
  subscribeToPlanValidation,
  renewSubscriptionValidation
} from '../validations/subscription.validation.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/plans', getSubscriptionPlans);

router.get('/my', verifyJWT, verifyUser, getMySubscription);
router.post('/subscribe', verifyJWT, verifyUser, subscribeToPlanValidation, subscribeToPlan);
router.patch('/cancel', verifyJWT, verifyUser, cancelSubscription);
router.post('/renew', verifyJWT, verifyUser, renewSubscriptionValidation, renewSubscription);

router.get('/admin/all', verifyJWT, verifyAdmin, getAllSubscriptions);
router.get('/admin/stats', verifyJWT, verifyAdmin, getSubscriptionStats);

export default router;
