import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  verifySignupOTP,
  resendSignupOTP,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

// OTP Verification Routes (Modern 6-digit passcode flow)
router.post('/verify-otp', verifySignupOTP);
router.post('/resend-otp', resendSignupOTP);

// Legacy Email Verification Routes (Direct cryptographic link)
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Forgot & Reset Password Routes (Supports both 6-digit OTP & legacy token)
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/reset-password', resetPassword);

export default router;
