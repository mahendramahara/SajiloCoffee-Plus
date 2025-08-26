import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/order.controller.js';
import {
  createOrderValidation,
  getOrdersValidation,
  getOrderByIdValidation,
  updateOrderStatusValidation
} from '../validations/order.validation.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/', verifyJWT, verifyUser, createOrderValidation, createOrder);
router.get('/my-orders', verifyJWT, verifyUser, getOrdersValidation, getOrders);
router.get('/my-orders/:orderId', verifyJWT, verifyUser, getOrderByIdValidation, getOrderById);
router.put('/my-orders/:orderId/cancel', verifyJWT, verifyUser, getOrderByIdValidation, cancelOrder);

router.get('/all', verifyJWT, verifyAdmin, getOrdersValidation, getAllOrders);
router.put('/:orderId/status', verifyJWT, verifyAdmin, updateOrderStatusValidation, updateOrderStatus);
router.get('/stats', verifyJWT, verifyAdmin, getOrderStats);

export default router;
