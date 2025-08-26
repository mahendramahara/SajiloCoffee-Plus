import { Router } from 'express';
import {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches
} from '../controllers/search.controller.js';

const router = Router();

router.get('/products', searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingSearches);

export default router;
