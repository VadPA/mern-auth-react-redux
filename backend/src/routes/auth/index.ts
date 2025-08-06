import { Router } from 'express';
import {
  resendOTP,
  signup,
  verifyAccount,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../../controllers/userController';
import { isAuthenticated } from '../../middleware/isAuthenticated';

const router = Router();

router.post('/register', signup);
router.post('/verify', isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword)

export default router;
