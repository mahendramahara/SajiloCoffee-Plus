import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import Order from '../models/order.model.js';

export const checkUserSubscription = async (userId) => {
  try {
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gte: new Date() }
    }).populate('planId');

    return subscription;
  } catch (error) {
    return null;
  }
};

export const applySubscriptionDiscount = (subtotal, subscription) => {
  if (!subscription) return 0;
  
  switch (subscription.planId.cycle) {
    case 'monthly':
      return subtotal * 0.10;
    case '6-month':
      return subtotal * 0.15;
    case 'annual':
      return subtotal * 0.20;
    default:
      return 0;
  }
};

export const getSubscriptionPerks = (subscription) => {
  if (!subscription) {
    return {
      hasSubscription: false,
      discountPercentage: 0,
      freePowderGrams: 0,
      indoorVisitsPerMonth: 0,
      privateSpaceHours: 0,
      features: []
    };
  }

  const plan = subscription.planId;
  let discountPercentage = 0;

  switch (plan.cycle) {
    case 'monthly':
      discountPercentage = 10;
      break;
    case '6-month':
      discountPercentage = 15;
      break;
    case 'annual':
      discountPercentage = 20;
      break;
  }

  return {
    hasSubscription: true,
    planName: plan.name,
    planCycle: plan.cycle,
    discountPercentage,
    freePowderGrams: plan.perks.freePowderGrams || 0,
    indoorVisitsPerMonth: plan.perks.indoorVisitsPerMonth || 0,
    privateSpaceHours: plan.perks.privateSpaceHours || 0,
    features: plan.features || [],
    endDate: subscription.endDate,
    autoRenew: subscription.autoRenew
  };
};

export const validateSubscriptionBenefit = async (userId, benefitType) => {
  const subscription = await checkUserSubscription(userId);
  if (!subscription) return false;

  const plan = subscription.planId;
  
  switch (benefitType) {
    case 'discount':
      return true;
    case 'freePowder':
      return plan.perks.freePowderGrams > 0;
    case 'indoorVisit':
      return plan.perks.indoorVisitsPerMonth > 0 || plan.perks.indoorVisitsPerMonth === -1;
    case 'privateSpace':
      return plan.perks.privateSpaceHours > 0;
    default:
      return false;
  }
};

export const getMonthlyUsage = async (userId, currentMonth = new Date()) => {
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const ordersThisMonth = await Order.countDocuments({
    userId,
    placedAt: { $gte: startOfMonth, $lte: endOfMonth },
    subscriptionPerkApplied: true
  });

  return {
    ordersWithDiscount: ordersThisMonth,
    period: {
      start: startOfMonth,
      end: endOfMonth
    }
  };
};
