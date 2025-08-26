import Order from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import { Table } from '../models/table.model.js';
import { Rating } from '../models/rating.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';
import { sentEmail } from '../utils/setEmail.js';
import { orderConfirmationTemplate, orderStatusUpdateTemplate } from '../utils/emailTemplates.js';
import { systemLogger } from '../utils/systemLogger.js';
import { createNotification } from './notification.controller.js';
import { checkUserSubscription, applySubscriptionDiscount, getSubscriptionPerks } from '../utils/subscriptionUtils.js';

export const createOrder = async (req, res) => {
  try {
    const { tableNumber, items, subscriptionPerkApplied = false } = req.body;

    if (!items || items.length === 0) {
      return validation(res, 'Order must contain at least one item');
    }

    const table = await Table.findOne({ tableNumber });
    if (!table) {
      return notFound(res, 'Table not found');
    }

    if (table.status === 'occupied') {
      return validation(res, 'Table is currently occupied');
    }

    let subtotal = 0;
    let discount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.available) {
        return validation(res, `Product ${product?.name || 'unknown'} is not available`);
      }

      let unitPrice = product.price;
      if (product.sizes && product.sizes.length > 0) {
        const sizeInfo = product.sizes.find(s => s.size === item.size);
        if (!sizeInfo) {
          return validation(res, `Invalid size ${item.size} for product ${product.name}`);
        }
        unitPrice = sizeInfo.price;
      }

      const itemTotal = unitPrice * item.qty;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        size: item.size,
        qty: item.qty,
        unitPrice,
        addons: item.addons || []
      });
    }

    if (subscriptionPerkApplied) {
      const subscription = await checkUserSubscription(req.user._id);
      if (subscription) {
        discount = applySubscriptionDiscount(subtotal, subscription);
      }
    }

    const total = subtotal - discount;

    const order = new Order({
      userId: req.user._id,
      table: tableNumber,
      items: orderItems,
      subtotal,
      discount,
      total,
      subscriptionPerkApplied
    });

    await order.save();

    table.status = 'occupied';
    table.currentOrderId = order._id;
    await table.save();

    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], updatedAt: new Date() }
    );

    systemLogger.order(order._id, 'created', req.user._id, {
      table: tableNumber,
      itemCount: orderItems.length,
      total: total,
      subscriptionPerkApplied
    });

    createNotification(
      req.user._id,
      'Order Placed Successfully',
      `Your order #${order._id} has been placed for table ${tableNumber}`,
      'success',
      { orderId: order._id, table: tableNumber }
    );

    try {
      await sentEmail({
        to: req.user.email,
        subject: 'Order Confirmation - Sajilo Coffee Plus',
        html: orderConfirmationTemplate(req.user.name, order)
      });
      systemLogger.info('Order confirmation email sent', { orderId: order._id, email: req.user.email });
    } catch (emailError) {
      systemLogger.error('Order confirmation email failed', emailError, { orderId: order._id });
    }

    const populatedOrder = await Order.findById(order._id).populate('items.productId');
    return success(res, populatedOrder, 'Order created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create order', 500);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.productId')
      .sort({ placedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    return success(res, {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    }, 'Orders retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get orders', 500);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id 
    }).populate('items.productId');

    if (!order) {
      return notFound(res, 'Order not found');
    }

    return success(res, order, 'Order retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get order', 500);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id 
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    if (order.status !== 'pending') {
      return validation(res, 'Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    const table = await Table.findOne({ tableNumber: order.table });
    if (table && table.currentOrderId?.toString() === orderId) {
      table.status = 'available';
      table.currentOrderId = null;
      await table.save();
    }

    systemLogger.order(orderId, 'cancelled', req.user._id, { table: order.table });

    try {
      await sentEmail({
        to: req.user.email,
        subject: 'Order Cancelled - Sajilo Coffee Plus',
        html: orderStatusUpdateTemplate(req.user.name, order, 'cancelled')
      });
      systemLogger.info('Order cancellation email sent', { orderId, email: req.user.email });
    } catch (emailError) {
      systemLogger.error('Order cancellation email failed', emailError, { orderId });
    }

    return success(res, order, 'Order cancelled successfully');
  } catch (err) {
    return error(res, 'Failed to cancel order', 500);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, table, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (table) filter.table = parseInt(table);

    const orders = await Order.find(filter)
      .populate('items.productId')
      .populate('userId', 'name email phone')
      .sort({ placedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    return success(res, {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    }, 'All orders retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get orders', 500);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return notFound(res, 'Order not found');
    }

    const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return validation(res, 'Invalid status');
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    if (status === 'served' || status === 'cancelled') {
      const table = await Table.findOne({ tableNumber: order.table });
      if (table && table.currentOrderId?.toString() === orderId) {
        table.status = 'available';
        table.currentOrderId = null;
        await table.save();
      }
    }

    systemLogger.order(orderId, `status updated to ${status}`, 'admin', { 
      table: order.table, 
      userId: order.userId._id 
    });

    createNotification(
      order.userId._id,
      'Order Status Updated',
      `Your order #${orderId} is now ${status}`,
      status === 'served' ? 'success' : status === 'cancelled' ? 'error' : 'info',
      { orderId, status, table: order.table }
    );

    try {
      await sentEmail({
        to: order.userId.email,
        subject: `Order ${status} - Sajilo Coffee Plus`,
        html: orderStatusUpdateTemplate(order.userId.name, order, status)
      });
      systemLogger.info('Order status update email sent', { orderId, status, email: order.userId.email });
    } catch (emailError) {
      systemLogger.error('Order status update email failed', emailError, { orderId, status });
    }

    return success(res, order, 'Order status updated successfully');
  } catch (err) {
    return error(res, 'Failed to update order status', 500);
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalOrders, pendingOrders, preparingOrders] = await Promise.all([
      Order.countDocuments({ placedAt: { $gte: today } }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'preparing' })
    ]);

    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['served'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const todayRevenue = await Order.aggregate([
      { $match: { placedAt: { $gte: today }, status: 'served' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    return success(res, {
      todayOrders,
      totalOrders,
      pendingOrders,
      preparingOrders,
      totalRevenue: revenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0
    }, 'Order statistics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get order statistics', 500);
  }
};
