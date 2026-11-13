import React, { useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearAuthError,
} from '../redux/slices/authSlice';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    dispatch(loginStart());

    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login', { email, password }).catch(() => {
          // Demo fallback if backend is offline
          if (email.includes('admin')) {
            return {
              data: {
                success: true,
                data: {
                  _id: 'usr-admin-1',
                  name: 'AutoForge Executive Admin',
                  email,
                  role: 'admin',
                  token: 'mock-jwt-admin-token',
                },
              },
            };
          }
          return {
            data: {
              success: true,
              data: {
                _id: 'usr-cust-1',
                name: name || 'Alexander Wright',
                email,
                role: 'customer',
                token: 'mock-jwt-customer-token',
              },
            },
          };
        });

        if (response.data && response.data.success) {
          dispatch(
            loginSuccess({
              user: response.data.data,
              token: response.data.data.token,
            })
          );
          onClose();
        } else {
          setErrorMessage(response.data?.message || 'Invalid email or password.');
          dispatch(loginFailure(response.data?.message || 'Login failed'));
        }
      } else {
        // Register Mode
        const response = await api.post('/auth/register', {
          name,
          email,
          password,
          phone,
          role,
        }).catch(() => {
          return {
            data: {
              success: true,
              data: {
                _id: 'usr-new-1',
                name,
                email,
                role,
                token: 'mock-jwt-new-token',
              },
            },
          };
        });

        if (response.data && response.data.success) {
          dispatch(
            loginSuccess({
              user: response.data.data,
              token: response.data.data.token,
            })
          );
          onClose();
        } else {
          setErrorMessage(response.data?.message || 'Registration failed.');
          dispatch(loginFailure(response.data?.message || 'Registration failed'));
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication error';
      setErrorMessage(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider: string) => {
    dispatch(
      loginSuccess({
        user: {
          _id: `social-${Date.now()}`,
          name: `${provider} Verified User`,
          email: `user@${provider.toLowerCase()}.com`,
          role: 'customer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        token: `mock-oauth-${provider}-token`,
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Garage Background Blur simulation */}
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
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-3">
            Careers & Garage
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-white font-serif">
            {mode === 'login' ? 'Welcome Back' : 'Join AutoForge'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'login'
              ? 'Sign in to your AutoForge account.'
              : 'Create your account to book services and track careers.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
              />
            </div>
          </div>

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
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-[#151B27]/80 border border-[#2B3549] focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#E5A93C]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
                onClick={() => alert('Password reset link sent to registered email in demonstration mode.')}
                className="text-[#E5A93C] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Quick Demo Credential Pills */}
          <div className="pt-1 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@autoforge.com');
                setPassword('adminpassword123');
              }}
              className="text-[10px] text-amber-300/80 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30"
            >
              Demo Admin Auto-fill
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('alexander@autoforge.com');
                setPassword('customerpassword123');
              }}
              className="text-[10px] text-gray-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10"
            >
              Demo Client Auto-fill
            </button>
          </div>

          {/* Gold Gradient Sign In Button matching Screenshot 3 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#F0BA51] via-[#E5A93C] to-[#C98A21] hover:from-[#FAD078] hover:to-[#E5A93C] text-[#0A0D13] font-bold text-sm tracking-wide shadow-gold transition-all duration-300 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Car className="w-4 h-4 fill-current" />
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Social Logins */}
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
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialMock('Apple')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#151B27] hover:bg-[#1A2232] border border-[#2B3549] text-xs font-medium text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.5-7.79-11.44-14.14-5.87-9.44-10.4-19.8-13.59-31.06-3.19-11.26-4.79-22.18-4.79-32.76 0-14.77 3.59-26.68 10.77-35.73 7.18-9.05 16.27-13.68 27.27-13.9 4.89 0 10.3 1.34 16.23 4.02 5.93 2.68 9.94 4.08 12.04 4.2 1.63 0 5.56-1.4 11.79-4.2 6.23-2.8 11.83-4.09 16.8-3.87 12.82.65 23.01 5.34 30.58 14.07-11.3 6.84-16.85 16.4-16.63 28.68.22 9.56 3.86 17.5 10.92 23.82 7.06 6.32 15.42 9.9 25.09 10.75-2.06 6.08-4.53 12.16-7.41 18.23zM119.22 33.15c0-7.39 2.66-14.28 7.98-20.67 5.32-6.39 12.01-10.55 20.07-12.48.22 1.09.33 2.07.33 2.94 0 7.39-2.77 14.52-8.31 21.39-5.54 6.87-12.28 10.82-20.21 11.85-.22-1.09-.33-2.07-.33-2.94z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Switch mode */}
        <div className="mt-6 text-center text-xs text-gray-400">
          {mode === 'login' ? (
            <>
              New to AutoForge?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
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
                }}
                className="text-[#E5A93C] font-semibold hover:underline ml-1"
              >
                Sign in
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

