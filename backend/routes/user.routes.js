import { Router } from 'express';
import { 
    register, 
    verifyEmail, 
    resendVerificationOTP,
    login, 
    forgetPassword, 
    resetPassword, 
    changePassword, 
    getUsers, 
    getUserById, 
    getMe, 
    updateUser, 
    deleteUser, 
    logout 
} from '../controllers/user.controller.js';
import { 
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    updateUserValidation,
    getUserByIdValidation,
    resendOTPValidation
} from '../validations/user.validation.js';
import { verifyJWT, verifyUser, verifyAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/fileUpload.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/resend-otp', resendOTPValidation, resendVerificationOTP);
router.post('/login', loginValidation, login);
router.post('/forget-password', forgetPasswordValidation, forgetPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

router.post('/change-password', verifyJWT, verifyUser, changePasswordValidation, changePassword);
router.get('/users', verifyJWT, verifyAdmin, getUsers);
router.get('/user/:id', verifyJWT, getUserByIdValidation, getUserById);
router.get('/me', verifyJWT, verifyUser, getMe);
router.put('/update', verifyJWT, verifyUser, upload.single('avatar'), updateUserValidation, updateUser);
router.delete('/delete', verifyJWT, verifyUser, deleteUser);
router.post('/logout', verifyJWT, verifyUser, logout);

export default router;
