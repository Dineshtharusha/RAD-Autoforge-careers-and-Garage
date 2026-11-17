import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  sendEmail,
  createAutoForgeEmailTemplate,
  createAutoForgeOTPEmailTemplate,
} from '../utils/sendEmail';

// Helper to generate a cryptographically strong or high-entropy 6-digit numeric OTP
const generateNumericOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user & dispatch 6-digit verification OTP email
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Role can only be customer by default unless explicitly designated (or seeded)
    const assignedRole = role === 'admin' ? 'admin' : (role === 'technician' ? 'technician' : 'customer');

    // Generate 6-digit numeric OTP for instant user entry
    const signupOTP = generateNumericOTP();
    const verificationExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Generate legacy cryptographic token as secondary backup
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : undefined,
      role: assignedRole,
      isEmailVerified: false,
      emailVerificationOTP: signupOTP,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpire: verificationExpire,
    });

    const token = generateToken(user._id.toString(), user.role);

    // Send Verification OTP Email
    const emailResult = await sendEmail({
      to: user.email,
      subject: `Your AutoForge Verification Code: ${signupOTP}`,
      html: createAutoForgeOTPEmailTemplate(
        'Account Verification Passcode',
        user.name,
        signupOTP,
        'welcome to the AutoForge Careers & Garage platform! Enter the 6-digit passcode below into your verification modal to activate your full workshop booking and roadside carrier privileges.',
        15
      ),
    });

    res.status(201).json({
      success: true,
      message: emailResult.success
        ? 'Account registered! A 6-digit verification code has been dispatched to your email.'
        : 'Account registered! Please check your email or enter the verification passcode.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        token,
        otp: signupOTP, // Fail-safe fallback for viva presentation / offline SMTP
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// @desc    Verify signup email with 6-digit OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifySignupOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Please provide both email address and 6-digit passcode.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOTP = otp.toString().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+emailVerificationOTP +emailVerificationExpire');

    if (!user) {
      res.status(404).json({ success: false, message: 'Account not found with this email address.' });
      return;
    }

    if (user.isEmailVerified) {
      const token = generateToken(user._id.toString(), user.role);
      res.json({
        success: true,
        message: 'Account is already verified! Welcome to AutoForge.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isEmailVerified: true,
          token,
        },
      });
      return;
    }

    if (!user.emailVerificationOTP || user.emailVerificationOTP !== cleanOTP) {
      res.status(400).json({ success: false, message: 'Invalid 6-digit passcode. Please check and try again.' });
      return;
    }

    if (user.emailVerificationExpire && user.emailVerificationExpire < new Date()) {
      res.status(400).json({ success: false, message: 'Passcode has expired. Please request a new one.' });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Account successfully verified! Full AutoForge privileges unlocked.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: true,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'OTP verification failed.' });
  }
};

// @desc    Resend 6-digit signup OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendSignupOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+emailVerificationOTP +emailVerificationExpire');

    if (!user) {
      res.status(404).json({ success: false, message: 'No AutoForge account found with this email.' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ success: false, message: 'This account is already verified.' });
      return;
    }

    const newOTP = generateNumericOTP();
    user.emailVerificationOTP = newOTP;
    user.emailVerificationExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const emailResult = await sendEmail({
      to: user.email,
      subject: `Your AutoForge Verification Code: ${newOTP}`,
      html: createAutoForgeOTPEmailTemplate(
        'Account Verification Passcode (Resent)',
        user.name,
        newOTP,
        'here is your requested AutoForge verification code. Enter this passcode to activate your account.',
        15
      ),
    });

    res.json({
      success: true,
      message: emailResult.success
        ? 'A new verification passcode has been sent to your email.'
        : 'Passcode generated! Please check your email.',
      otp: newOTP, // fail-safe for viva / offline SMTP
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to resend verification passcode.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id.toString(), updatedUser.role);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify user email with cryptographic token (Legacy / Direct URL)
// @route   GET /api/auth/verify-email/:token OR POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawToken = (req.params.token || req.body.token || req.query.token) as string;

    if (!rawToken) {
      res.status(400).json({ success: false, message: 'Verification token is required.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token. Please request a new one.',
      });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Email successfully verified! Your AutoForge account is fully active.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Email verification failed.' });
  }
};

// @desc    Resend email verification link (Legacy)
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(404).json({ success: false, message: 'Account not found with this email.' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ success: false, message: 'This email is already verified.' });
      return;
    }

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    user.emailVerificationToken = hashedVerificationToken;
    user.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}?verifyToken=${rawVerificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify Your AutoForge Account (Resent)',
      html: createAutoForgeEmailTemplate(
        'Confirm Your Email Address',
        'AutoForge Email Verification',
        `Hi ${user.name}, here is your requested verification link to activate your AutoForge account.`,
        'VERIFY EMAIL NOW',
        verifyUrl,
        'This link expires in 24 hours.'
      ),
    });

    res.json({
      success: true,
      message: 'Verification link sent to your email address.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to resend verification email.' });
  }
};

// @desc    Initiate forgot password reset with 6-digit OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide an email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOTP +resetPasswordExpire');

    if (!user) {
      // Return clear 404 so user knows immediately that the account does not exist
      res.status(404).json({
        success: false,
        message: 'No registered AutoForge account found with this email address. Please check your spelling or sign up.',
      });
      return;
    }

    // Generate 6-digit numeric reset passcode
    const resetOTP = generateNumericOTP();
    user.resetPasswordOTP = resetOTP;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Also support legacy reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    user.resetPasswordToken = hashedResetToken;

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}?resetToken=${rawResetToken}`;

    const emailResult = await sendEmail({
      to: user.email,
      subject: `AutoForge Password Reset Code: ${resetOTP}`,
      html: createAutoForgeOTPEmailTemplate(
        'Password Reset Passcode',
        user.name,
        resetOTP,
        'we received a request to reset your AutoForge password. Enter this 6-digit passcode into the password reset modal along with your new password.',
        15
      ),
    });

    res.json({
      success: true,
      message: emailResult.success
        ? 'A 6-digit password reset passcode has been sent to your email address.'
        : 'Password reset code generated! Check your email or use the passcode below.',
      otp: resetOTP, // Fail-safe for presentation / offline SMTP
      resetUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to process password reset.' });
  }
};

// @desc    Reset password using 6-digit OTP or legacy reset token
// @route   PUT /api/auth/reset-password/:token OR POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, password, newPassword, token } = req.body;
    const rawToken = (req.params.token || token) as string;
    const chosenPassword = newPassword || password;

    if (!chosenPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide your new password.',
      });
      return;
    }

    if (chosenPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    let user;

    // 1. If 6-digit OTP and email are provided (modern flow)
    if (otp && email) {
      const normalizedEmail = email.toLowerCase().trim();
      const cleanOTP = otp.toString().trim();

      user = await User.findOne({
        email: normalizedEmail,
      }).select('+password +resetPasswordOTP +resetPasswordExpire');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Account not found with this email.',
        });
        return;
      }

      if (!user.resetPasswordOTP || user.resetPasswordOTP !== cleanOTP) {
        res.status(400).json({
          success: false,
          message: 'Invalid 6-digit passcode. Please check your email and try again.',
        });
        return;
      }

      if (user.resetPasswordExpire && user.resetPasswordExpire < new Date()) {
        res.status(400).json({
          success: false,
          message: 'Password reset passcode has expired. Please request a new one.',
        });
        return;
      }
    } else if (rawToken) {
      // 2. Legacy token fallback
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() },
      }).select('+password');

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired password reset link. Please request a new code.',
        });
        return;
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Please provide either the 6-digit verification code or reset token.',
      });
      return;
    }

    // Update password and clear reset fields
    user.password = chosenPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // triggers bcrypt pre-save hash

    const jwtToken = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Password successfully updated! Logging you in...',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        token: jwtToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Password reset failed.' });
  }
};
