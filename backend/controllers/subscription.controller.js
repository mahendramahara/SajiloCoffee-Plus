import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';
import { sentEmail } from '../utils/setEmail.js';
import { systemLogger } from '../utils/systemLogger.js';

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ price: 1 });
    return success(res, plans, 'Subscription plans retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get subscription plans', 500);
  }
};

export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return notFound(res, 'Subscription plan not found');
    }

    const existingSubscription = await Subscription.findOne({ 
      userId: req.user._id,
      status: { $in: ['active'] }
    });

    if (existingSubscription) {
      return validation(res, 'You already have an active subscription');
    }

    let duration;
    switch (plan.cycle) {
      case 'monthly':
        duration = 30;
        break;
      case '6-month':
        duration = 180;
        break;
      case 'annual':
        duration = 365;
        break;
      default:
        return validation(res, 'Invalid subscription cycle');
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
    const renewAt = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));

    const subscription = new Subscription({
      planId,
      userId: req.user._id,
      status: 'active',
      startDate,
      endDate,
      renewAt,
      autoRenew: true
    });

    await subscription.save();

    systemLogger.subscription(subscription._id, 'activated', req.user._id, {
      planName: plan.name,
      planCycle: plan.cycle,
      startDate,
      endDate
    });

    try {
      await sentEmail({
        to: req.user.email,
        subject: 'Subscription Activated - Sajilo Coffee Plus',
        html: `
          <h2>Welcome to ${plan.name}!</h2>
          <p>Your subscription has been activated successfully.</p>
          <p>Subscription Period: ${startDate.toDateString()} - ${endDate.toDateString()}</p>
          <p>Enjoy your premium coffee experience!</p>
        `
      });
      systemLogger.info('Subscription activation email sent', { subscriptionId: subscription._id, email: req.user.email });
    } catch (emailError) {
      systemLogger.error('Subscription activation email failed', emailError, { subscriptionId: subscription._id });
    }

    const populatedSubscription = await Subscription.findById(subscription._id).populate('planId');
    return success(res, populatedSubscription, 'Subscription activated successfully', 201);
  } catch (err) {
    return error(res, 'Failed to subscribe to plan', 500);
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.user._id,
      status: { $in: ['active', 'expired'] }
    }).populate('planId').sort({ startDate: -1 });

    if (!subscription) {
      return success(res, null, 'No subscription found');
    }

    const now = new Date();
    if (subscription.status === 'active' && subscription.endDate < now) {
      subscription.status = 'expired';
      await subscription.save();
    }

    return success(res, subscription, 'Subscription retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get subscription', 500);
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.user._id,
      status: 'active'
    }).populate('planId');

    if (!subscription) {
      return notFound(res, 'No active subscription found');
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    systemLogger.subscription(subscription._id, 'cancelled', req.user._id, {
      planName: subscription.planId.name,
      endDate: subscription.endDate
    });

    try {
      await sentEmail({
        to: req.user.email,
        subject: 'Subscription Cancelled - Sajilo Coffee Plus',
        html: `
          <h2>Subscription Cancelled</h2>
          <p>Your ${subscription.planId.name} subscription has been cancelled.</p>
          <p>You can continue using premium features until ${subscription.endDate.toDateString()}.</p>
          <p>We hope to see you back soon!</p>
        `
      });
      systemLogger.info('Subscription cancellation email sent', { subscriptionId: subscription._id, email: req.user.email });
    } catch (emailError) {
      systemLogger.error('Subscription cancellation email failed', emailError, { subscriptionId: subscription._id });
    }

    return success(res, subscription, 'Subscription cancelled successfully');
  } catch (err) {
    return error(res, 'Failed to cancel subscription', 500);
  }
};

export const renewSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return notFound(res, 'Subscription plan not found');
    }

    const currentSubscription = await Subscription.findOne({ 
      userId: req.user._id,
      status: { $in: ['active', 'expired'] }
    }).sort({ endDate: -1 });

    if (currentSubscription && currentSubscription.status === 'active') {
      return validation(res, 'You already have an active subscription');
    }

    let duration;
    switch (plan.cycle) {
      case 'monthly':
        duration = 30;
        break;
      case '6-month':
        duration = 180;
        break;
      case 'annual':
        duration = 365;
        break;
      default:
        return validation(res, 'Invalid subscription cycle');
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
    const renewAt = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));

    const subscription = new Subscription({
      planId,
      userId: req.user._id,
      status: 'active',
      startDate,
      endDate,
      renewAt,
      autoRenew: true
    });

    await subscription.save();

    systemLogger.subscription(subscription._id, 'renewed', req.user._id, {
      planName: plan.name,
      planCycle: plan.cycle,
      startDate,
      endDate
    });

    try {
      await sentEmail({
        to: req.user.email,
        subject: 'Subscription Renewed - Sajilo Coffee Plus',
        html: `
          <h2>Welcome Back to ${plan.name}!</h2>
          <p>Your subscription has been renewed successfully.</p>
          <p>New Subscription Period: ${startDate.toDateString()} - ${endDate.toDateString()}</p>
          <p>Continue enjoying your premium coffee experience!</p>
        `
      });
      systemLogger.info('Subscription renewal email sent', { subscriptionId: subscription._id, email: req.user.email });
    } catch (emailError) {
      systemLogger.error('Subscription renewal email failed', emailError, { subscriptionId: subscription._id });
    }

    const populatedSubscription = await Subscription.findById(subscription._id).populate('planId');
    return success(res, populatedSubscription, 'Subscription renewed successfully', 201);
  } catch (err) {
    return error(res, 'Failed to renew subscription', 500);
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const { status, planId, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (planId) filter.planId = planId;

    const subscriptions = await Subscription.find(filter)
      .populate('userId', 'name email phone')
      .populate('planId')
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscription.countDocuments(filter);

    return success(res, {
      subscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSubscriptions: total
      }
    }, 'Subscriptions retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get subscriptions', 500);
  }
};

export const getSubscriptionStats = async (req, res) => {
  try {
    const [activeSubscriptions, expiredSubscriptions, cancelledSubscriptions] = await Promise.all([
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'expired' }),
      Subscription.countDocuments({ status: 'cancelled' })
    ]);

    const revenue = await Subscription.aggregate([
      {
        $match: { status: { $in: ['active', 'expired'] } }
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      {
        $unwind: '$plan'
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$plan.price' }
        }
      }
    ]);

    const planDistribution = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      { $unwind: '$plan' },
      {
        $group: {
          _id: '$plan.name',
          count: { $sum: 1 }
        }
      }
    ]);

    return success(res, {
      activeSubscriptions,
      expiredSubscriptions,
      cancelledSubscriptions,
      totalRevenue: revenue[0]?.total || 0,
      planDistribution
    }, 'Subscription statistics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get subscription statistics', 500);
  }
};
