import { Router } from 'express';
import {
  getTables,
  getTableById,
  getTableByNumber,
  createTable,
  updateTable,
  deleteTable,
  reserveTable,
  releaseTable
} from '../controllers/table.controller.js';
import {
  createTableValidation,
  updateTableValidation,
  getTableByIdValidation,
  getTableByNumberValidation
} from '../validations/table.validation.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getTables);
router.get('/:tableId', getTableByIdValidation, getTableById);
router.get('/number/:tableNumber', getTableByNumberValidation, getTableByNumber);

router.post('/', verifyJWT, verifyAdmin, createTableValidation, createTable);
router.put('/:tableId', verifyJWT, verifyAdmin, updateTableValidation, updateTable);
router.delete('/:tableId', verifyJWT, verifyAdmin, getTableByIdValidation, deleteTable);
router.put('/number/:tableNumber/reserve', verifyJWT, verifyUser, getTableByNumberValidation, reserveTable);
router.put('/number/:tableNumber/release', verifyJWT, verifyAdmin, getTableByNumberValidation, releaseTable);

export default router;
