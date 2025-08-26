import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return success(res, { items: [], total: 0 }, 'Cart retrieved successfully');
    }

    let total = 0;
    const validItems = [];

    for (const item of cart.items) {
      if (item.productId && item.productId.available) {
        const product = item.productId;
        let itemPrice = product.price;
        
        if (product.sizes && product.sizes.length > 0) {
          const sizeInfo = product.sizes.find(s => s.size === item.size);
          if (sizeInfo) {
            itemPrice = sizeInfo.price;
          }
        }
        
        const itemTotal = itemPrice * item.qty;
        total += itemTotal;
        
        validItems.push({
          ...item.toObject(),
          unitPrice: itemPrice,
          total: itemTotal
        });
      }
    }

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return success(res, { items: validItems, total }, 'Cart retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get cart', 500);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size, qty = 1, addons = [] } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    if (!product.available) {
      return validation(res, 'Product is not available');
    }

    if (product.sizes && product.sizes.length > 0) {
      const validSize = product.sizes.find(s => s.size === size);
      if (!validSize) {
        return validation(res, 'Invalid size selected');
      }
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && 
               item.size === size &&
               JSON.stringify(item.addons.sort()) === JSON.stringify(addons.sort())
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].qty += qty;
    } else {
      cart.items.push({ productId, size, qty, addons });
    }

    cart.updatedAt = new Date();
    await cart.save();

    systemLogger.activity(req.user._id, 'item added to cart', {
      productId,
      productName: product.name,
      size,
      qty,
      addons
    });

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    return success(res, populatedCart, 'Item added to cart successfully');
  } catch (err) {
    return error(res, 'Failed to add item to cart', 500);
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { qty, addons } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return notFound(res, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return notFound(res, 'Item not found in cart');
    }

    if (qty !== undefined) {
      if (qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].qty = qty;
      }
    }

    if (addons !== undefined) {
      cart.items[itemIndex].addons = addons;
    }

    cart.updatedAt = new Date();
    await cart.save();

    systemLogger.activity(req.user._id, 'cart item updated', {
      itemId,
      qty,
      addons
    });

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    return success(res, populatedCart, 'Cart updated successfully');
  } catch (err) {
    return error(res, 'Failed to update cart item', 500);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return notFound(res, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return notFound(res, 'Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    await cart.save();

    systemLogger.activity(req.user._id, 'item removed from cart', { itemId });

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    return success(res, populatedCart, 'Item removed from cart successfully');
  } catch (err) {
    return error(res, 'Failed to remove item from cart', 500);
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return success(res, { items: [], total: 0 }, 'Cart is already empty');
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    systemLogger.activity(req.user._id, 'cart cleared');

    return success(res, { items: [], total: 0 }, 'Cart cleared successfully');
  } catch (err) {
    return error(res, 'Failed to clear cart', 500);
  }
};
