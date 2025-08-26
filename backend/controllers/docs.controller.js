import { success } from '../utils/apiResponse.js';

export const getApiDocumentation = async (req, res) => {
  const apiDoc = {
    title: 'Sajilo Coffee Plus API Documentation',
    version: '1.0.0',
    description: 'Complete API documentation for Sajilo Coffee Plus platform',
    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
    endpoints: {
      auth: {
        register: {
          method: 'POST',
          path: '/user/register',
          description: 'Register a new user account',
          body: {
            name: 'string',
            email: 'string',
            phone: 'string',
            password: 'string'
          }
        },
        login: {
          method: 'POST',
          path: '/user/login',
          description: 'Login to user account',
          body: {
            email: 'string',
            password: 'string'
          }
        },
        logout: {
          method: 'POST',
          path: '/user/logout',
          description: 'Logout from user account',
          auth: 'required'
        }
      },
      products: {
        getAll: {
          method: 'GET',
          path: '/products',
          description: 'Get all products with filtering and pagination',
          query: {
            category: 'string (optional)',
            search: 'string (optional)',
            minPrice: 'number (optional)',
            maxPrice: 'number (optional)',
            limit: 'number (optional, default: 20)',
            page: 'number (optional, default: 1)'
          }
        },
        getById: {
          method: 'GET',
          path: '/products/:productId',
          description: 'Get product by ID'
        },
        getFeatured: {
          method: 'GET',
          path: '/products/featured',
          description: 'Get featured products'
        },
        rate: {
          method: 'POST',
          path: '/products/:productId/rate',
          description: 'Rate a product',
          auth: 'required',
          body: {
            rating: 'number (1-5)',
            feedback: 'string (optional)'
          }
        }
      },
      cart: {
        get: {
          method: 'GET',
          path: '/cart',
          description: 'Get user cart',
          auth: 'required'
        },
        add: {
          method: 'POST',
          path: '/cart/add',
          description: 'Add item to cart',
          auth: 'required',
          body: {
            productId: 'string',
            size: 'string (single|regular|large)',
            qty: 'number (optional, default: 1)',
            addons: 'array (optional)'
          }
        },
        update: {
          method: 'PUT',
          path: '/cart/item/:itemId',
          description: 'Update cart item',
          auth: 'required',
          body: {
            qty: 'number (optional)',
            addons: 'array (optional)'
          }
        },
        remove: {
          method: 'DELETE',
          path: '/cart/item/:itemId',
          description: 'Remove item from cart',
          auth: 'required'
        },
        clear: {
          method: 'DELETE',
          path: '/cart/clear',
          description: 'Clear entire cart',
          auth: 'required'
        }
      },
      orders: {
        create: {
          method: 'POST',
          path: '/orders',
          description: 'Create new order',
          auth: 'required',
          body: {
            tableNumber: 'number',
            items: 'array',
            subscriptionPerkApplied: 'boolean (optional)'
          }
        },
        getMyOrders: {
          method: 'GET',
          path: '/orders/my-orders',
          description: 'Get user orders',
          auth: 'required',
          query: {
            status: 'string (optional)',
            limit: 'number (optional)',
            page: 'number (optional)'
          }
        },
        cancel: {
          method: 'PUT',
          path: '/orders/my-orders/:orderId/cancel',
          description: 'Cancel order',
          auth: 'required'
        },
        getAllOrders: {
          method: 'GET',
          path: '/orders/all',
          description: 'Get all orders (admin only)',
          auth: 'admin'
        },
        updateStatus: {
          method: 'PUT',
          path: '/orders/:orderId/status',
          description: 'Update order status (admin only)',
          auth: 'admin',
          body: {
            status: 'string (pending|preparing|served|cancelled)'
          }
        }
      },
      subscriptions: {
        getPlans: {
          method: 'GET',
          path: '/subscriptions/plans',
          description: 'Get all subscription plans'
        },
        subscribe: {
          method: 'POST',
          path: '/subscriptions/subscribe',
          description: 'Subscribe to a plan',
          auth: 'required',
          body: {
            planId: 'string'
          }
        },
        getMy: {
          method: 'GET',
          path: '/subscriptions/my-subscription',
          description: 'Get user subscription',
          auth: 'required'
        },
        cancel: {
          method: 'PUT',
          path: '/subscriptions/cancel',
          description: 'Cancel subscription',
          auth: 'required'
        }
      },
      recommendations: {
        get: {
          method: 'GET',
          path: '/recommendations',
          description: 'Get personalized recommendations',
          auth: 'required'
        },
        refresh: {
          method: 'POST',
          path: '/recommendations/refresh',
          description: 'Refresh recommendations',
          auth: 'required'
        }
      },
      tables: {
        getAll: {
          method: 'GET',
          path: '/tables',
          description: 'Get all tables',
          query: {
            status: 'string (optional)'
          }
        },
        reserve: {
          method: 'PUT',
          path: '/tables/number/:tableNumber/reserve',
          description: 'Reserve a table',
          auth: 'required'
        }
      },
      notifications: {
        get: {
          method: 'GET',
          path: '/notifications',
          description: 'Get user notifications',
          auth: 'required'
        },
        markRead: {
          method: 'PUT',
          path: '/notifications/:notificationId/read',
          description: 'Mark notification as read',
          auth: 'required'
        }
      },
      dashboard: {
        admin: {
          method: 'GET',
          path: '/dashboard/admin',
          description: 'Get admin dashboard statistics',
          auth: 'admin'
        },
        user: {
          method: 'GET',
          path: '/dashboard/user',
          description: 'Get user dashboard',
          auth: 'required'
        }
      },
      search: {
        products: {
          method: 'GET',
          path: '/search/products',
          description: 'Search products',
          query: {
            q: 'string',
            category: 'string (optional)',
            minPrice: 'number (optional)',
            maxPrice: 'number (optional)',
            sortBy: 'string (optional)'
          }
        },
        suggestions: {
          method: 'GET',
          path: '/search/suggestions',
          description: 'Get search suggestions',
          query: {
            q: 'string'
          }
        }
      }
    },
    responseFormat: {
      success: {
        success: true,
        message: 'string',
        data: 'object|array|null'
      },
      error: {
        success: false,
        message: 'string',
        errors: 'array (optional)'
      }
    },
    authHeader: {
      name: 'Authorization',
      format: 'Bearer <token>'
    }
  };

  return success(res, apiDoc, 'API documentation retrieved successfully');
};
