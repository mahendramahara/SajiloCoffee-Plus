import Subscription from '../models/subscription.model.js';
import { systemLogger } from '../utils/systemLogger.js';
import { sentEmail } from '../utils/setEmail.js';

export const updateExpiredSubscriptions = async (req, res, next) => {
  try {
    const now = new Date();
    
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: now }
    }).populate('userId').populate('planId');

    for (const subscription of expiredSubscriptions) {
      subscription.status = 'expired';
      await subscription.save();

      systemLogger.subscription(subscription._id, 'expired', subscription.userId._id, {
        planName: subscription.planId.name,
        endDate: subscription.endDate
      });

      try {
        await sentEmail({
          to: subscription.userId.email,
          subject: 'Subscription Expired - Sajilo Coffee Plus',
          html: `
            <h2>Subscription Expired</h2>
            <p>Your ${subscription.planId.name} subscription has expired.</p>
            <p>Renew now to continue enjoying premium benefits!</p>
            <p>We miss you already and hope to serve you again soon.</p>
          `
        });
      } catch (emailError) {
        systemLogger.error('Subscription expiry email failed', emailError, { 
          subscriptionId: subscription._id 
        });
      }
    }

    if (expiredSubscriptions.length > 0) {
      systemLogger.info(`Updated ${expiredSubscriptions.length} expired subscriptions`);
    }
  } catch (error) {
    systemLogger.error('Failed to update expired subscriptions', error);
  }
  
  next();
};
