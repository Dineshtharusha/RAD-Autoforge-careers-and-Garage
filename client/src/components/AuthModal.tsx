import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Car,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../redux/slices/authSlice';
import { api, authApi } from '../services/api';

export type AuthMode =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'verify-otp'
  | 'reset-password-otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  resetToken?: string;
  verifyToken?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  resetToken = '',
  verifyToken = '',
}) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');

  // OTP Fields
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync mode with initialMode prop
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
      setOtp('');
    }
  }, [initialMode, isOpen]);

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle direct verify-email invocation (cryptographic token link)
  useEffect(() => {
    if (isOpen && mode === 'verify-email' && verifyToken) {
      handleAutoVerify(verifyToken);
    }
  }, [isOpen, mode, verifyToken]);

  const handleAutoVerify = async (token: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await authApi.verifyEmail(token);
      if (res.data?.success) {
        setSuccessMessage('Your email has been successfully verified! Your AutoForge account is fully active.');
        if (res.data.data?.token) {
          dispatch(
            loginSuccess({
              user: res.data.data,
              token: res.data.data.token,
            })
          );
        }
      } else {
        setErrorMessage(res.data?.message || 'Verification failed. The link may have expired.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid or expired verification link.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignupOTP = async () => {
    if (resendCooldown > 0 || resending || !email) return;
    setResending(true);
    setErrorMessage(null);
    try {
      await authApi.resendSignupOTP(email);
      setSuccessMessage('A new 6-digit verification passcode has been dispatched to your email!');
      setResendCooldown(30);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleResendResetOTP = async () => {
    if (resendCooldown > 0 || resending || !email) return;
    setResending(true);
    setErrorMessage(null);
    try {
      await authApi.forgotPassword(email);
      setSuccessMessage('A new 6-digit password reset passcode has been dispatched to your email!');
      setResendCooldown(30);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend passcode.');
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        dispatch(loginStart());
        try {
          const response = await authApi.login({ email, password });
          if (response.data && response.data.success) {
            dispatch(
              loginSuccess({
                user: response.data.data,
                token: response.data.data.token,
              })
            );
            onClose();
          } else {
            const msg = response.data?.message || 'Invalid email or password.';
            setErrorMessage(msg);
            dispatch(loginFailure(msg));
          }
        } catch (loginErr: any) {
          const msg =
            loginErr.response?.data?.message ||
            'Invalid email or password. Please verify your credentials.';
          setErrorMessage(msg);
          dispatch(loginFailure(msg));
        }
      } else if (mode === 'register') {
        dispatch(loginStart());
        try {
          const res = await authApi.register({
            name,
            email,
            password,
            phone,
            role,
          });

          if (res.data?.success) {
            setMode('verify-otp');
            setSuccessMessage('Account registered! Enter the 6-digit passcode sent to your email to verify.');
            setResendCooldown(30);
          } else {
            setErrorMessage(res.data?.message || 'Registration failed.');
            dispatch(loginFailure(res.data?.message || 'Registration failed'));
          }
        } catch (regErr: any) {
          const msg = regErr.response?.data?.message || 'Registration failed.';
          setErrorMessage(msg);
          dispatch(loginFailure(msg));
        }
      } else if (mode === 'verify-otp') {
        // Submit 6-digit OTP for signup verification
        if (!otp || otp.length !== 6) {
          setErrorMessage('Please enter the full 6-digit verification passcode.');
          setLoading(false);
          return;
        }

        try {
          const res = await authApi.verifySignupOTP(email, otp);
          if (res.data?.success) {
            setSuccessMessage('Account verified successfully! Welcome to AutoForge.');
            if (res.data.data?.token) {
              dispatch(
                loginSuccess({
                  user: res.data.data,
                  token: res.data.data.token,
                })
              );
            }
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            setErrorMessage(res.data?.message || 'Invalid passcode. Please try again.');
          }
        } catch (verifyErr: any) {
          setErrorMessage(verifyErr.response?.data?.message || 'Verification passcode incorrect or expired.');
        }
      } else if (mode === 'forgot-password') {
        // Send Forgot Password OTP
        try {
          const res = await authApi.forgotPassword(email);
          if (res.data?.success) {
            setMode('reset-password-otp');
            setSuccessMessage('Password reset passcode sent! Please check your inbox.');
            setResendCooldown(30);
          } else {
            setErrorMessage(res.data?.message || 'Could not send reset code.');
          }
        } catch (err: any) {
          setErrorMessage(err.response?.data?.message || 'No registered account found with this email.');
        }
      } else if (mode === 'reset-password-otp') {
        // Reset Password with 6-digit OTP + New Password
        if (!otp || otp.length !== 6) {
          setErrorMessage('Please enter the 6-digit verification code.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        try {
          const res = await authApi.resetPasswordWithOTP(email, otp, password);
          if (res.data?.success) {
            setSuccessMessage('Password updated successfully! Logging you in...');
            if (res.data.data?.token) {
              dispatch(
                loginSuccess({
                  user: res.data.data,
                  token: res.data.data.token,
                })
              );
            }
            setTimeout(() => {
              onClose();
            }, 1600);
          } else {
            setErrorMessage(res.data?.message || 'Failed to update password.');
          }
        } catch (err: any) {
          setErrorMessage(err.response?.data?.message || 'Invalid passcode or expired request.');
        }
      } else if (mode === 'reset-password') {
        // Legacy token reset submission
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        try {
          const res = await authApi.resetPassword(resetToken, password);
          if (res.data?.success) {
            setSuccessMessage('Password successfully updated! Logging you in...');
            if (res.data.data?.token) {
              dispatch(
                loginSuccess({
                  user: res.data.data,
                  token: res.data.data.token,
                })
              );
            }
            setTimeout(() => {
              onClose();
            }, 1600);
          } else {
            setErrorMessage(res.data?.message || 'Failed to reset password.');
          }
        } catch (err: any) {
          setErrorMessage(err.response?.data?.message || 'Invalid or expired password reset link.');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication error';
      setErrorMessage(msg);
      if (mode === 'login' || mode === 'register') {
        dispatch(loginFailure(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider: string) => {
    setErrorMessage(
      `${provider} OAuth is currently in demonstration mode. Please sign in using your registered AutoForge email and password.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Garage Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0F141E]/95 border border-[#2E374A]/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-8 text-white backdrop-blur-2xl">
        {/* Subtle ambient gold glow in corner */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E2535] to-[#0A0D13] border border-[#E5A93C]/50 shadow-gold mb-3">
            <span className="font-serif text-2xl font-black text-[#E5A93C]">AF</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#E5A93C] rounded-br" />
          </div>
          <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#E5A93C]">
            AutoForge
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-2">
            Careers & Garage
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-white font-serif">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join AutoForge'}
            {mode === 'verify-otp' && 'Verify Your Email'}
            {mode === 'forgot-password' && 'Reset Password'}
            {mode === 'reset-password-otp' && 'Set New Password'}
            {mode === 'reset-password' && 'New Password'}
            {mode === 'verify-email' && 'Email Verification'}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {mode === 'login' && 'Sign in to access your garage bookings and carrier telemetry.'}
            {mode === 'register' && 'Create your account to book services and track careers.'}
            {mode === 'verify-otp' && `Enter the 6-digit passcode sent to ${email}`}
            {mode === 'forgot-password' && 'Enter your email address to receive a 6-digit reset code.'}
            {mode === 'reset-password-otp' && `Enter the 6-digit code sent to ${email} and set your new password.`}
            {mode === 'reset-password' && 'Choose a secure password for your AutoForge account.'}
            {mode === 'verify-email' && 'Verifying your email token with the AutoForge central server.'}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 flex items-start gap-2.5 p-3 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* VERIFY EMAIL MODE (Legacy Cryptographic Link) */}
        {mode === 'verify-email' ? (
          <div className="text-center py-6 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#E5A93C]" />
                <p className="text-xs text-gray-400">Validating token with cryptographic authentication...</p>
              </div>
            ) : successMessage ? (
              <div className="space-y-4">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider"
                >
                  Continue to AutoForge
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full py-3 rounded-lg border border-[#E5A93C] text-[#E5A93C] font-bold text-xs uppercase tracking-wider"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD FORM SUBMISSION */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER: Full Name */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexander Wright"
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field (for login, register, forgot-password) */}
            {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@autoforge.com"
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* REGISTER: Phone Number */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* OTP CODE INPUT (For verify-otp and reset-password-otp) */}
            {(mode === 'verify-otp' || mode === 'reset-password-otp') && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-medium text-gray-300 uppercase tracking-wider">
                    6-Digit Passcode
                  </label>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || resending}
                    onClick={mode === 'verify-otp' ? handleResendSignupOTP : handleResendResetOTP}
                    className="text-[11px] text-[#E5A93C] hover:underline disabled:opacity-50 flex items-center gap-1"
                  >
                    {resending && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>
                      {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend Code'}
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-center font-mono text-xl tracking-[0.4em] text-[#E5A93C] placeholder-gray-600 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password Field (for login, register, reset-password, reset-password-otp) */}
            {(mode === 'login' ||
              mode === 'register' ||
              mode === 'reset-password' ||
              mode === 'reset-password-otp') && (
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  {mode === 'reset-password' || mode === 'reset-password-otp'
                    ? 'New Password'
                    : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === 'reset-password' || mode === 'reset-password-otp'
                        ? 'Min. 6 characters'
                        : 'Enter your password'
                    }
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password Field (for reset-password and reset-password-otp) */}
            {(mode === 'reset-password' || mode === 'reset-password-otp') && (
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Login Remember Me & Forgot Password Link */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#2B3549] text-[#E5A93C] focus:ring-[#E5A93C] bg-[#151B27]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[#E5A93C] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#F0BA51] via-[#E5A93C] to-[#C98A21] hover:from-[#FAD078] hover:to-[#E5A93C] text-[#0A0D13] font-bold text-sm tracking-wide shadow-gold transition-all duration-300 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'forgot-password' && (
                    <>
                      <Mail className="w-4 h-4 fill-current" />
                      <span>Send Recovery Passcode</span>
                    </>
                  )}
                  {mode === 'verify-otp' && (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Activate Account</span>
                    </>
                  )}
                  {(mode === 'reset-password' || mode === 'reset-password-otp') && (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Update Password & Sign In</span>
                    </>
                  )}
                  {mode === 'login' && (
                    <>
                      <Car className="w-4 h-4 fill-current" />
                      <span>Sign In</span>
                    </>
                  )}
                  {mode === 'register' && (
                    <>
                      <Car className="w-4 h-4 fill-current" />
                      <span>Create Account</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        )}

        {/* Back / Navigation buttons for sub-modes */}
        {(mode === 'forgot-password' || mode === 'verify-otp' || mode === 'reset-password-otp') && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
                setOtp('');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Social Logins (Only on Login or Register) */}
        {(mode === 'login' || mode === 'register') && (
          <>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#232C3E]" />
              </div>
              <span className="relative bg-[#0F141E] px-3 text-[11px] text-gray-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialMock('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#151B27] hover:bg-[#1A2232] border border-[#2B3549] text-xs font-medium text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                onClick={() => handleSocialMock('Apple')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#151B27] hover:bg-[#1A2232] border border-[#2B3549] text-xs font-medium text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.5-7.79-11.44-14.14-5.87-9.44-10.4-19.8-13.59-31.06-3.19-11.26-4.79-22.18-4.79-32.76 0-14.77 3.59-26.68 10.77-35.73 7.18-9.05 16.27-13.68 27.27-13.9 4.89 0 10.3 1.34 16.23 4.02 5.93 2.68 9.94 4.08 12.04 4.2 1.63 0 5.56-1.4 11.79-4.2 6.23-2.8 11.83-4.09 16.8-3.87 12.82.65 23.01 5.34 30.58 14.07-11.3 6.84-16.85 16.4-16.63 28.68.22 9.56 3.86 17.5 10.92 23.82 7.06 6.32 15.42 9.9 25.09 10.75-2.06 6.08-4.53 12.16-7.41 18.23zM119.22 33.15c0-7.39 2.66-14.28 7.98-20.67 5.32-6.39 12.01-10.55 20.07-12.48.22 1.09.33 2.07.33 2.94 0 7.39-2.77 14.52-8.31 21.39-5.54 6.87-12.28 10.82-20.21 11.85-.22-1.09-.33-2.07-.33-2.94z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Switch mode between login & register */}
            <div className="mt-6 text-center text-xs text-gray-400">
              {mode === 'login' ? (
                <>
                  New to AutoForge?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#E5A93C] font-semibold hover:underline ml-1"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#E5A93C] font-semibold hover:underline ml-1"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
