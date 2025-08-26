import { success, error, notFound } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';
import { sentEmail } from '../utils/setEmail.js';

const notifications = [];

export const createNotification = (userId, title, message, type = 'info', metadata = {}) => {
  const notification = {
    id: Date.now().toString(),
    userId,
    title,
    message,
    type,
    metadata,
    read: false,
    createdAt: new Date()
  };
  
  notifications.push(notification);
  
  systemLogger.info('Notification created', {
    notificationId: notification.id,
    userId,
    title,
    type
  });
  
  return notification;
};

export const getUserNotifications = async (req, res) => {
  try {
    const userNotifications = notifications
      .filter(notif => notif.userId === req.user._id.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50);

    const unreadCount = userNotifications.filter(notif => !notif.read).length;

    return success(res, {
      notifications: userNotifications,
      unreadCount
    }, 'Notifications retrieved successfully');
  } catch (err) {
    systemLogger.error('Failed to get notifications', err, { userId: req.user._id });
    return error(res, 'Failed to get notifications', 500);
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = notifications.find(
      notif => notif.id === notificationId && notif.userId === req.user._id.toString()
    );
    
    if (!notification) {
      return notFound(res, 'Notification not found');
    }
    
    notification.read = true;
    
    systemLogger.activity(req.user._id, 'notification marked as read', { notificationId });
    
    return success(res, notification, 'Notification marked as read');
  } catch (err) {
    systemLogger.error('Failed to mark notification as read', err, { userId: req.user._id });
    return error(res, 'Failed to mark notification as read', 500);
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userNotifications = notifications.filter(
      notif => notif.userId === req.user._id.toString() && !notif.read
    );
    
    userNotifications.forEach(notif => {
      notif.read = true;
    });
    
    systemLogger.activity(req.user._id, 'all notifications marked as read', { 
      count: userNotifications.length 
    });
    
    return success(res, null, `${userNotifications.length} notifications marked as read`);
  } catch (err) {
    systemLogger.error('Failed to mark all notifications as read', err, { userId: req.user._id });
    return error(res, 'Failed to mark notifications as read', 500);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const index = notifications.findIndex(
      notif => notif.id === notificationId && notif.userId === req.user._id.toString()
    );
    
    if (index === -1) {
      return notFound(res, 'Notification not found');
    }
    
    notifications.splice(index, 1);
    
    systemLogger.activity(req.user._id, 'notification deleted', { notificationId });
    
    return success(res, null, 'Notification deleted successfully');
  } catch (err) {
    systemLogger.error('Failed to delete notification', err, { userId: req.user._id });
    return error(res, 'Failed to delete notification', 500);
  }
};

export const sendBulkNotification = async (req, res) => {
  try {
    const { title, message, type = 'info', userIds, sendEmail = false } = req.body;
    
    const targetUsers = userIds || [];
    const createdNotifications = [];
    
    for (const userId of targetUsers) {
      const notification = createNotification(userId, title, message, type);
      createdNotifications.push(notification);
    }
    
    if (sendEmail && targetUsers.length > 0) {
      try {
        await sentEmail({
          to: req.user.email,
          subject: title,
          html: `
            <h2>${title}</h2>
            <p>${message}</p>
            <hr>
            <p>This is an automated notification from Sajilo Coffee Plus.</p>
          `
        });
        
        systemLogger.info('Bulk notification emails sent', { 
          count: targetUsers.length,
          title 
        });
      } catch (emailError) {
        systemLogger.error('Bulk notification email failed', emailError, { 
          count: targetUsers.length 
        });
      }
    }
    
    systemLogger.activity('admin', 'bulk notification sent', {
      recipientCount: targetUsers.length,
      title,
      type
    });
    
    return success(res, {
      notifications: createdNotifications,
      count: createdNotifications.length
    }, 'Bulk notification sent successfully', 201);
  } catch (err) {
    systemLogger.error('Failed to send bulk notification', err);
    return error(res, 'Failed to send bulk notification', 500);
  }
};

export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = notifications.length;
    const unreadNotifications = notifications.filter(notif => !notif.read).length;
    const notificationsByType = notifications.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
      return acc;
    }, {});
    
    const recentNotifications = notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    return success(res, {
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      recentNotifications
    }, 'Notification statistics retrieved successfully');
  } catch (err) {
    systemLogger.error('Failed to get notification stats', err);
    return error(res, 'Failed to get notification statistics', 500);
  }
};
