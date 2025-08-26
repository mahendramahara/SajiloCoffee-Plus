import Order from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import Subscription from '../models/subscription.model.js';
import { Rating } from '../models/rating.model.js';
import { success, error } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    const [
      todayOrders,
      weeklyOrders,
      monthlyOrders,
      totalOrders,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalRevenue,
      activeSubscriptions,
      totalProducts,
      averageRating,
      pendingOrders
    ] = await Promise.all([
      Order.countDocuments({ placedAt: { $gte: today } }),
      Order.countDocuments({ placedAt: { $gte: thisWeek } }),
      Order.countDocuments({ placedAt: { $gte: thisMonth } }),
      Order.countDocuments(),
      
      Order.aggregate([
        { $match: { placedAt: { $gte: today }, status: 'served' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      Order.aggregate([
        { $match: { placedAt: { $gte: thisWeek }, status: 'served' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      Order.aggregate([
        { $match: { placedAt: { $gte: thisMonth }, status: 'served' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      Order.aggregate([
        { $match: { status: 'served' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      Subscription.countDocuments({ status: 'active' }),
      Product.countDocuments({ available: true }),
      
      Rating.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      
      Order.countDocuments({ status: 'pending' })
    ]);

    const topProducts = await Order.aggregate([
      { $match: { status: 'served' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.qty', '$items.unitPrice'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name')
      .sort({ placedAt: -1 })
      .limit(10);

    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return success(res, {
      stats: {
        orders: {
          today: todayOrders,
          weekly: weeklyOrders,
          monthly: monthlyOrders,
          total: totalOrders,
          pending: pendingOrders
        },
        revenue: {
          today: todayRevenue[0]?.total || 0,
          weekly: weeklyRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
          total: totalRevenue[0]?.total || 0
        },
        subscriptions: {
          active: activeSubscriptions
        },
        products: {
          total: totalProducts
        },
        ratings: {
          average: Math.round((averageRating[0]?.avgRating || 0) * 10) / 10
        }
      },
      topProducts,
      recentOrders,
      orderStatusDistribution
    }, 'Dashboard statistics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get dashboard statistics', 500);
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [
      totalOrders,
      completedOrders,
      activeSubscription,
      totalSpent,
      favoriteCategory,
      recentOrders,
      recommendations
    ] = await Promise.all([
      Order.countDocuments({ userId }),
      Order.countDocuments({ userId, status: 'served' }),
      
      Subscription.findOne({ userId, status: 'active' }).populate('planId'),
      
      Order.aggregate([
        { $match: { userId, status: 'served' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      Order.aggregate([
        { $match: { userId, status: 'served' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            count: { $sum: '$items.qty' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),
      
      Order.find({ userId })
        .populate('items.productId', 'name')
        .sort({ placedAt: -1 })
        .limit(5),
      
      Product.find({ available: true })
        .sort({ ratingAverage: -1 })
        .limit(3)
    ]);

    return success(res, {
      stats: {
        totalOrders,
        completedOrders,
        totalSpent: totalSpent[0]?.total || 0,
        favoriteCategory: favoriteCategory[0]?._id || 'None'
      },
      activeSubscription,
      recentOrders,
      recommendations
    }, 'User dashboard retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get user dashboard', 500);
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;
    
    let matchCondition = { status: 'served' };
    
    if (startDate && endDate) {
      matchCondition.placedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const now = new Date();
      let fromDate = new Date();
      
      switch (period) {
        case 'day':
          fromDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case 'month':
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case 'year':
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
      }
      
      matchCondition.placedAt = { $gte: fromDate };
    }

    const salesData = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            year: { $year: '$placedAt' },
            month: { $month: '$placedAt' },
            day: { $dayOfMonth: '$placedAt' }
          },
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
          averageOrder: { $avg: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const categoryAnalytics = await Order.aggregate([
      { $match: matchCondition },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.qty', '$items.unitPrice'] } },
          quantity: { $sum: '$items.qty' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    return success(res, {
      salesData,
      categoryAnalytics,
      period: period,
      dateRange: {
        start: matchCondition.placedAt?.$gte || null,
        end: matchCondition.placedAt?.$lte || null
      }
    }, 'Sales analytics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get sales analytics', 500);
  }
};
