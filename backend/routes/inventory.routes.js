import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getProductStats
} from '../controllers/inventory.controller.js';
import {
  createProductValidation,
  updateProductValidation,
  deleteProductValidation
} from '../validations/inventory.validation.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(verifyJWT, verifyAdmin);

router.post('/products', createProductValidation, createProduct);
router.put('/products/:productId', updateProductValidation, updateProduct);
router.delete('/products/:productId', deleteProductValidation, deleteProduct);
router.patch('/products/:productId/toggle', deleteProductValidation, toggleProductAvailability);
router.get('/products/stats', getProductStats);

export default router;
