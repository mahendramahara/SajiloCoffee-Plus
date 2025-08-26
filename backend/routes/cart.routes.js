import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import {
  addToCartValidation,
  updateCartItemValidation,
  removeFromCartValidation
} from '../validations/cart.validation.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.js';

const router = Router();

router.use(verifyJWT, verifyUser);

router.get('/', getCart);
router.post('/add', addToCartValidation, addToCart);
router.put('/item/:itemId', updateCartItemValidation, updateCartItem);
router.delete('/item/:itemId', removeFromCartValidation, removeFromCart);
router.delete('/clear', clearCart);

export default router;
