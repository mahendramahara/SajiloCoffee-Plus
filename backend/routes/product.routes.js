import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  rateProduct,
  getProductRatings
} from '../controllers/product.controller.js';
import {
  getProductsValidation,
  getProductByIdValidation,
  getProductBySlugValidation,
  rateProductValidation
} from '../validations/product.validation.js';
import { verifyJWT, verifyUser } from '../middlewares/auth.js';

const router = Router();

router.get('/', getProductsValidation, getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/popular', getPopularProducts);
router.get('/:productId', getProductByIdValidation, getProductById);
router.get('/slug/:slug', getProductBySlugValidation, getProductBySlug);
router.get('/:productId/ratings', getProductByIdValidation, getProductRatings);

router.post('/:productId/rate', verifyJWT, verifyUser, rateProductValidation, rateProduct);

export default router;
