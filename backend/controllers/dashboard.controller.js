import Order from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import { Rating } from '../models/rating.model.js';
import User from '../models/user.model.js';
import { success, error } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const timeRanges = {
      today: new Date(new Date().setHours(0, 0, 0, 0)),
      yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
      week: new Date(new Date().setDate(new Date().getDate() - 7)),
      month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      quarter: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      year: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    };

    const [
      overviewStats,
      revenueAnalytics,
      orderAnalytics,
      subscriptionAnalytics,
      productPerformance,
      customerInsights,
      recentActivity
    ] = await Promise.all([
      getOverviewStats(timeRanges),
      getRevenueAnalytics(timeRanges),
      getOrderAnalytics(timeRanges),
      getSubscriptionAnalytics(timeRanges),
      getProductPerformance(timeRanges),
      getCustomerInsights(timeRanges),
      getRecentActivity()
    ]);

    return success(res, {
      overview: overviewStats,
      revenue: revenueAnalytics,
      orders: orderAnalytics,
      subscriptions: subscriptionAnalytics,
      products: productPerformance,
      customers: customerInsights,
      recentActivity,
      timestamp: new Date()
    }, 'Dashboard statistics retrieved successfully');
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return error(res, 'Failed to get dashboard statistics', 500);
  }
};

const getOverviewStats = async (timeRanges) => {
  const [todayStats, weekStats, monthStats, totalStats] = await Promise.all([
    Order.aggregate([
      {
        $facet: {
          orders: [
            { $match: { placedAt: { $gte: timeRanges.today } } },
            { $count: "count" }
          ],
          revenue: [
            { $match: { placedAt: { $gte: timeRanges.today }, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          avgOrderValue: [
            { $match: { placedAt: { $gte: timeRanges.today }, paymentStatus: 'paid' } },
            { $group: { _id: null, avg: { $avg: '$total' } } }
          ]
        }
      }
    ]),
    Order.aggregate([
      {
        $facet: {
          orders: [
            { $match: { placedAt: { $gte: timeRanges.week } } },
            { $count: "count" }
          ],
          revenue: [
            { $match: { placedAt: { $gte: timeRanges.week }, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]
        }
      }
    ]),
    Order.aggregate([
      {
        $facet: {
          orders: [
            { $match: { placedAt: { $gte: timeRanges.month } } },
            { $count: "count" }
          ],
          revenue: [
            { $match: { placedAt: { $gte: timeRanges.month }, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]
        }
      }
    ]),
    Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Subscription.countDocuments({ status: 'active' }),
      Product.countDocuments({ available: true })
    ])
  ]);

  return {
    today: {
      orders: todayStats[0]?.orders[0]?.count || 0,
      revenue: todayStats[0]?.revenue[0]?.total || 0,
      avgOrderValue: todayStats[0]?.avgOrderValue[0]?.avg || 0
    },
    week: {
      orders: weekStats[0]?.orders[0]?.count || 0,
      revenue: weekStats[0]?.revenue[0]?.total || 0
    },
    month: {
      orders: monthStats[0]?.orders[0]?.count || 0,
      revenue: monthStats[0]?.revenue[0]?.total || 0
    },
    total: {
      orders: totalStats[0],
      revenue: totalStats[1][0]?.total || 0,
      activeSubscriptions: totalStats[2],
      availableProducts: totalStats[3]
    }
  };
};

const getRevenueAnalytics = async (timeRanges) => {
  return await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    {
      $facet: {
        daily: [
          { $match: { placedAt: { $gte: timeRanges.month } } },
          {
            $group: {
              _id: {
                year: { $year: '$placedAt' },
                month: { $month: '$placedAt' },
                day: { $dayOfMonth: '$placedAt' }
              },
              revenue: { $sum: '$total' },
              orders: { $sum: 1 },
              avgOrder: { $avg: '$total' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
          { $limit: 30 }
        ],
        byPaymentMethod: [
          { $match: { placedAt: { $gte: timeRanges.month } } },
          {
            $group: {
              _id: '$paymentMethod',
              revenue: { $sum: '$total' },
              count: { $sum: 1 }
            }
          }
        ],
        byOrderType: [
          { $match: { placedAt: { $gte: timeRanges.month } } },
          {
            $group: {
              _id: '$orderType',
              revenue: { $sum: '$total' },
              count: { $sum: 1 }
            }
          }
        ],
        hourlyDistribution: [
          { $match: { placedAt: { $gte: timeRanges.week } } },
          {
            $group: {
              _id: { $hour: '$placedAt' },
              revenue: { $sum: '$total' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]
      }
    }
  ]).then(result => result[0]);
};

const getOrderAnalytics = async (timeRanges) => {
  return await Order.aggregate([
    {
      $facet: {
        statusDistribution: [
          { $match: { placedAt: { $gte: timeRanges.month } } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              revenue: { $sum: '$total' }
            }
          }
        ],
        preparationTimes: [
          { 
            $match: { 
              placedAt: { $gte: timeRanges.week },
              preparedAt: { $exists: true },
              status: { $in: ['ready', 'served'] }
            } 
          },
          {
            $addFields: {
              prepTime: {
                $divide: [
                  { $subtract: ['$preparedAt', '$placedAt'] },
                  1000 * 60
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              avgPrepTime: { $avg: '$prepTime' },
              minPrepTime: { $min: '$prepTime' },
              maxPrepTime: { $max: '$prepTime' }
            }
          }
        ],
        peakHours: [
          { $match: { placedAt: { $gte: timeRanges.week } } },
          {
            $group: {
              _id: { $hour: '$placedAt' },
              orderCount: { $sum: 1 },
              revenue: { $sum: '$total' }
            }
          },
          { $sort: { orderCount: -1 } },
          { $limit: 5 }
        ],
        categoryPerformance: [
          { $match: { placedAt: { $gte: timeRanges.month } } },
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.category',
              quantity: { $sum: '$items.qty' },
              revenue: { $sum: '$items.itemTotal' },
              orders: { $addToSet: '$_id' }
            }
          },
          {
            $addFields: {
              orderCount: { $size: '$orders' }
            }
          },
          { $sort: { revenue: -1 } }
        ]
      }
    }
  ]).then(result => result[0]);
};

const getSubscriptionAnalytics = async (timeRanges) => {
  const [subscriptionStats, planAnalytics] = await Promise.all([
    Subscription.aggregate([
      {
        $facet: {
          statusDistribution: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalRevenue: { $sum: '$totalPaid' }
              }
            }
          ],
          newSubscriptions: [
            { $match: { createdAt: { $gte: timeRanges.month } } },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$totalPaid' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ],
          churnAnalysis: [
            { $match: { status: 'cancelled', updatedAt: { $gte: timeRanges.month } } },
            {
              $group: {
                _id: '$cancellationReason',
                count: { $sum: 1 }
              }
            }
          ],
          renewalStats: [
            { $match: { renewAt: { $lte: new Date(), $gte: timeRanges.month } } },
            {
              $group: {
                _id: '$autoRenew',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]),
    SubscriptionPlan.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'planId',
          as: 'subscriptions'
        }
      },
      {
        $addFields: {
          activeSubscriptions: {
            $size: {
              $filter: {
                input: '$subscriptions',
                cond: { $eq: ['$$this.status', 'active'] }
              }
            }
          },
          totalRevenue: {
            $sum: '$subscriptions.totalPaid'
          }
        }
      },
      {
        $project: {
          name: 1,
          cycle: 1,
          price: 1,
          activeSubscriptions: 1,
          totalRevenue: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$currentSubscribers', 0] },
              { $multiply: [{ $divide: ['$activeSubscriptions', '$currentSubscribers'] }, 100] },
              0
            ]
          }
        }
      }
    ])
  ]);

  return {
    overview: subscriptionStats[0],
    planPerformance: planAnalytics
  };
};

const getProductPerformance = async (timeRanges) => {
  return await Order.aggregate([
    { $match: { placedAt: { $gte: timeRanges.month }, paymentStatus: 'paid' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        productName: { $first: '$items.productName' },
        category: { $first: '$items.category' },
        totalSold: { $sum: '$items.qty' },
        revenue: { $sum: '$items.itemTotal' },
        averagePrice: { $avg: '$items.unitPrice' },
        orders: { $addToSet: '$_id' }
      }
    },
    {
      $addFields: {
        orderCount: { $size: '$orders' }
      }
    },
    {
      $facet: {
        topByRevenue: [
          { $sort: { revenue: -1 } },
          { $limit: 10 }
        ],
        topByQuantity: [
          { $sort: { totalSold: -1 } },
          { $limit: 10 }
        ],
        lowPerformers: [
          { $sort: { revenue: 1 } },
          { $limit: 5 }
        ]
      }
    }
  ]).then(result => result[0]);
};

const getCustomerInsights = async (timeRanges) => {
  const [customerStats, loyaltyAnalysis] = await Promise.all([
    Order.aggregate([
      { $match: { placedAt: { $gte: timeRanges.month } } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrder: { $avg: '$total' },
          lastOrder: { $max: '$placedAt' },
          favoriteCategories: { $push: '$items.category' }
        }
      },
      {
        $facet: {
          topCustomers: [
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'customer'
              }
            },
            { $unwind: '$customer' }
          ],
          customerSegments: [
            {
              $bucket: {
                groupBy: '$totalSpent',
                boundaries: [0, 1000, 5000, 10000, Infinity],
                default: 'high-value',
                output: {
                  count: { $sum: 1 },
                  avgOrderValue: { $avg: '$averageOrder' }
                }
              }
            }
          ],
          newVsReturning: [
            {
              $group: {
                _id: {
                  $cond: [{ $eq: ['$orderCount', 1] }, 'new', 'returning']
                },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]).then(result => result[0]),
    
    Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'orders',
          localField: 'userId',
          foreignField: 'userId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: { $sum: '$orders.total' }
        }
      },
      {
        $group: {
          _id: null,
          subscriberOrderFreq: { $avg: '$orderCount' },
          subscriberAvgSpent: { $avg: '$totalSpent' },
          totalSubscribers: { $sum: 1 }
        }
      }
    ])
  ]);

  return {
    ...customerStats,
    subscriptionInsights: loyaltyAnalysis[0]
  };
};

const getRecentActivity = async () => {
  const [recentOrders, recentSubscriptions, systemAlerts] = await Promise.all([
    Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name image')
      .sort({ placedAt: -1 })
      .limit(10)
      .lean(),
    
    Subscription.find({ status: { $in: ['active', 'cancelled'] } })
      .populate('userId', 'name email')
      .populate('planId', 'name cycle price')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    
    Order.aggregate([
      {
        $facet: {
          pendingOrders: [
            { $match: { status: 'pending' } },
            { $count: 'count' }
          ],
          longPrepTimes: [
            {
              $match: {
                status: 'preparing',
                placedAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) }
              }
            },
            { $count: 'count' }
          ],
          lowStock: [
            {
              $lookup: {
                from: 'products',
                localField: 'items.productId',
                foreignField: '_id',
                as: 'products'
              }
            }
          ]
        }
      }
    ]).then(result => result[0])
  ]);

  return {
    recentOrders,
    recentSubscriptions,
    alerts: {
      pendingOrders: systemAlerts.pendingOrders[0]?.count || 0,
      longPrepTimes: systemAlerts.longPrepTimes[0]?.count || 0
    }
  };
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [
      userStats,
      userSubscription,
      recentOrders,
      recommendations,
      loyaltyProgress
    ] = await Promise.all([
      Order.aggregate([
        { $match: { userId: userId } },
        {
          $facet: {
            overview: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  completedOrders: {
                    $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
                  },
                  totalSpent: {
                    $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] }
                  },
                  avgOrderValue: { $avg: '$total' }
                }
              }
            ],
            monthlySpending: [
              { $match: { placedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
              {
                $group: {
                  _id: {
                    year: { $year: '$placedAt' },
                    month: { $month: '$placedAt' }
                  },
                  spent: { $sum: '$total' },
                  orders: { $sum: 1 }
                }
              },
              { $sort: { '_id.year': 1, '_id.month': 1 } }
            ],
            favoriteCategories: [
              { $match: { status: 'served' } },
              { $unwind: '$items' },
              {
                $group: {
                  _id: '$items.category',
                  count: { $sum: '$items.qty' },
                  spent: { $sum: '$items.itemTotal' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ]
          }
        }
      ]).then(result => result[0]),

      Subscription.findOne({ userId, status: 'active' })
        .populate('planId')
        .lean(),

      Order.find({ userId })
        .populate('items.productId', 'name image category')
        .sort({ placedAt: -1 })
        .limit(5)
        .lean(),

      Product.find({ available: true })
        .sort({ ratingAverage: -1 })
        .limit(6)
        .lean(),

      calculateLoyaltyProgress(userId)
    ]);

    return success(res, {
      stats: userStats.overview[0] || {
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0
      },
      monthlyTrends: userStats.monthlySpending,
      favoriteCategories: userStats.favoriteCategories,
      subscription: userSubscription,
      recentOrders,
      recommendations,
      loyaltyProgress
    }, 'User dashboard retrieved successfully');
  } catch (err) {
    console.error('User dashboard error:', err);
    return error(res, 'Failed to get user dashboard', 500);
  }
};

const calculateLoyaltyProgress = async (userId) => {
  const [orderCount, totalSpent] = await Promise.all([
    Order.countDocuments({ userId, status: 'served' }),
    Order.aggregate([
      { $match: { userId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
  ]);

  const spent = totalSpent[0]?.total || 0;
  const loyaltyTiers = [
    { name: 'Bronze', minOrders: 0, minSpent: 0, perks: ['5% discount'] },
    { name: 'Silver', minOrders: 10, minSpent: 5000, perks: ['10% discount', 'Free delivery'] },
    { name: 'Gold', minOrders: 25, minSpent: 15000, perks: ['15% discount', 'Priority support'] },
    { name: 'Platinum', minOrders: 50, minSpent: 50000, perks: ['20% discount', 'Exclusive products'] }
  ];

  let currentTier = loyaltyTiers[0];
  let nextTier = loyaltyTiers[1];

  for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
    if (orderCount >= loyaltyTiers[i].minOrders && spent >= loyaltyTiers[i].minSpent) {
      currentTier = loyaltyTiers[i];
      nextTier = loyaltyTiers[i + 1] || null;
      break;
    }
  }

  return {
    currentTier,
    nextTier,
    progress: {
      orders: orderCount,
      spent: spent,
      ordersToNext: nextTier ? Math.max(0, nextTier.minOrders - orderCount) : 0,
      spentToNext: nextTier ? Math.max(0, nextTier.minSpent - spent) : 0
    }
  };
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;
    
    let matchCondition = { paymentStatus: 'paid' };
    
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
        $group: {
          _id: '$items.category',
          revenue: { $sum: '$items.itemTotal' },
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
