import express from 'express';
import { 
  createAdmin, 
  loginAdmin,
  logoutAdmin,
  getAdmins, 
  getAdminById, 
  updateAdmin,
  deleteAdmin
} from '../controllers/admin.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/fileUpload.js';
import { createAdminValidation, updateAdminValidation, loginAdminValidation } from '../validations/admin.validation.js';

const router = express.Router();

router.post('/login', loginAdminValidation, loginAdmin);
router.post('/logout', verifyJWT, verifyAdmin, logoutAdmin);
router.post('/create', createAdminValidation, createAdmin);
router.get('/', verifyJWT, verifyAdmin, getAdmins);
router.get('/:id', verifyJWT, verifyAdmin, getAdminById);
router.put('/:id', verifyJWT, verifyAdmin, upload.single('avatar'), updateAdminValidation, updateAdmin);

router.delete('/:id', verifyJWT, verifyAdmin, deleteAdmin);

export default router;
