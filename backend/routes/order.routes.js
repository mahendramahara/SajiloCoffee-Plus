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
router.get('/my', verifyJWT, verifyUser, getOrdersValidation, getOrders);
router.get('/my/:orderId', verifyJWT, verifyUser, getOrderByIdValidation, getOrderById);
router.patch('/my/:orderId/cancel', verifyJWT, verifyUser, getOrderByIdValidation, cancelOrder);

router.get('/admin/all', verifyJWT, verifyAdmin, getOrdersValidation, getAllOrders);
router.patch('/admin/:orderId/status', verifyJWT, verifyAdmin, updateOrderStatusValidation, updateOrderStatus);
router.get('/admin/stats', verifyJWT, verifyAdmin, getOrderStats);

export default router;
