import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendBulkNotification,
  getNotificationStats
} from '../controllers/notification.controller.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyJWT, verifyUser, getUserNotifications);
router.put('/:notificationId/read', verifyJWT, verifyUser, markNotificationAsRead);
router.put('/mark-all-read', verifyJWT, verifyUser, markAllNotificationsAsRead);
router.delete('/:notificationId', verifyJWT, verifyUser, deleteNotification);

router.post('/bulk', verifyJWT, verifyAdmin, sendBulkNotification);
router.get('/stats', verifyJWT, verifyAdmin, getNotificationStats);

export default router;
