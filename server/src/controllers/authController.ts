import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendEmail, createAutoForgeEmailTemplate } from '../utils/sendEmail';

// @desc    Register a new user & dispatch verification email
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Role can only be customer by default unless explicitly designated (or seeded)
    const assignedRole = role === 'admin' ? 'admin' : (role === 'technician' ? 'technician' : 'customer');

    // Generate Email Verification Token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: assignedRole,
      isEmailVerified: false,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpire: verificationExpire,
    });

    const token = generateToken(user._id.toString(), user.role);

    // Send Verification Email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}?verifyToken=${rawVerificationToken}`;

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Verify Your AutoForge Account',
      html: createAutoForgeEmailTemplate(
        'Confirm Your Email Address',
        'Welcome to AutoForge',
        `Hi ${user.name}, welcome to the AutoForge Careers & Garage platform! Please verify your email address to activate your full workshop booking and roadside carrier privileges.`,
        'VERIFY EMAIL NOW',
        verifyUrl,
        'This verification link expires in 24 hours. If you did not create an AutoForge account, please disregard this email.'
      ),
    });

    res.status(201).json({
      success: true,
      message: emailResult.success
        ? 'Account created successfully! Verification email dispatched.'
        : 'Account created successfully! Check your email or use the verification link.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        token,
        verifyUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
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

    const user = await User.findOne({ email }).select('+password');
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

// @desc    Verify user email with cryptographic token
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

// @desc    Resend email verification link
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email address.' });
      return;
    }

    const user = await User.findOne({ email });
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

// @desc    Initiate forgot password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide an email address.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success status for security to prevent account enumeration
      res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
      return;
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}?resetToken=${rawResetToken}`;

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Reset Your AutoForge Password',
      html: createAutoForgeEmailTemplate(
        'Password Reset Request',
        'AutoForge Security',
        `Hi ${user.name}, we received a request to reset your AutoForge password. Click the button below to choose your new secure password.`,
        'RESET MY PASSWORD',
        resetUrl,
        'This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email; your password remains unchanged.'
      ),
    });

    res.json({
      success: true,
      message: emailResult.success
        ? 'Password reset link dispatched to your email address.'
        : 'Password reset link generated! If Gmail limits sending, you can use the direct reset link below.',
      resetUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to process password reset.' });
  }
};

// @desc    Reset password using crypto reset token
// @route   PUT /api/auth/reset-password/:token OR POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawToken = (req.params.token || req.body.token) as string;
    const { password, newPassword } = req.body;
    const chosenPassword = newPassword || password;

    if (!rawToken || !chosenPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide the reset token and your new password.',
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

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token. Please request a new link.',
      });
      return;
    }

    user.password = chosenPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // triggers bcrypt hash in pre-save hook

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Password successfully updated! You are now logged in.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Password reset failed.' });
  }
};

