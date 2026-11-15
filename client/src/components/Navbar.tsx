import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import {
  Calendar,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Shield,
  Bot,
  Car,
  BookmarkCheck,
  Wrench,
  Truck,
  Radio,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenBooking: () => void;
  onOpenAI: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenBooking,
  onOpenAI,
  activeTab,
  setActiveTab,
}) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

  // Customer Navigation Links (visible only for non-admin visitors)
  const customerNavLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'services', label: 'SERVICES' },
    { id: 'careers', label: 'CAREERS' },
    { id: 'workshops', label: 'WORKSHOPS' },
    { id: 'carrier', label: 'CARRIER' },
    { id: 'about', label: 'ABOUT US' },
  ];

  // Executive Admin Navigation Links (visible strictly when logged in as ADMIN)
  const adminNavLinks = [
    { id: 'admin-overview', label: 'DASHBOARD' },
    { id: 'admin-services', label: 'SERVICES' },
    { id: 'admin-lorries', label: 'CARRIER LORRIES' },
    { id: 'admin-tows', label: 'BREAKDOWN TOWS' },
    { id: 'admin-bookings', label: 'BOOKINGS' },
    { id: 'admin-applications', label: 'APPLICATIONS' },
  ];

  const navLinks = isAdmin ? adminNavLinks : customerNavLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#2C2B29]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => setActiveTab(isAdmin ? 'admin-overview' : 'home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-[#1E2535] to-[#0E121A] border border-[#E5A93C]/40 group-hover:border-[#E5A93C] transition-colors shadow-gold">
              <span className="font-serif text-2xl font-black tracking-tighter text-[#E5A93C]">
                AF
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr border-[#E5A93C]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white font-serif">
                AutoForge
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#E5A93C]">
                Careers & Garage
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isCurrent = activeTab === link.id || (isAdmin && link.id === 'admin-overview' && activeTab === 'admin');
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`text-xs tracking-widest font-semibold transition-colors duration-200 uppercase relative py-2 ${
                    isCurrent
                      ? (isAdmin ? 'text-red-400 font-bold' : 'text-[#E5A93C]')
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isCurrent && (
                    <span className={`absolute bottom-0 left-0 w-full h-[2px] ${
                      isAdmin ? 'bg-red-400 shadow-[0_0_8px_#ef4444]' : 'bg-[#E5A93C] shadow-[0_0_8px_#E5A93C]'
                    }`} />
                  )}
                </button>
              );
            })}

            {/* AI Assistant Button - ONLY FOR CUSTOMERS */}
            {!isAdmin && (
              <button
                onClick={onOpenAI}
                className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30 transition-all duration-200"
                title="AI Vehicle Diagnostic Assistant"
              >
                <Bot className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>AI Diagnostic</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Book Service Action Button - ONLY FOR CUSTOMERS */}
            {!isAdmin && (
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#E5A93C] text-[#E5A93C] text-xs font-bold tracking-wider uppercase hover:bg-[#E5A93C] hover:text-[#0B0E14] transition-all duration-300 shadow-[0_0_15px_rgba(229,169,60,0.15)] hover:shadow-[0_0_20px_rgba(229,169,60,0.4)]"
              >
                <span>BOOK SERVICE</span>
                <Calendar className="w-4 h-4" />
              </button>
            )}

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-full border transition-colors ${
                    isAdmin ? 'border-red-500 hover:border-red-400' : 'border-[#2C2B29] hover:border-[#E5A93C]'
                  }`}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className={`w-8 h-8 rounded-full object-cover ring-1 ${isAdmin ? 'ring-red-400' : 'ring-[#E5A93C]/50'}`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-xl bg-[#10141D] border border-[#2C2B29] shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#2C2B29]">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                        isAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    {/* Admin Options */}
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('admin-overview');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-white/5 flex items-center gap-2 font-semibold"
                        >
                          <Shield className="w-4 h-4 text-[#E5A93C]" />
                          <span>Admin Control Center</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('admin-services');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                        >
                          <Wrench className="w-4 h-4 text-[#E5A93C]" />
                          <span>Manage Services</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('admin-lorries');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                        >
                          <Truck className="w-4 h-4 text-emerald-400" />
                          <span>Manage Carrier Lorries</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTab('my-bookings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                      >
                        <BookmarkCheck className="w-4 h-4 text-[#E5A93C]" />
                        <span>My Bookings & Invoices</span>
                      </button>
                    )}

                    <div className="pt-1 mt-1 border-t border-[#2C2B29]">
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setActiveTab('home');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-10 h-10 rounded-full border border-[#2C2B29] flex items-center justify-center text-gray-300 hover:text-[#E5A93C] hover:border-[#E5A93C] transition-colors"
                title="Account Login"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="p-2 text-gray-300"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0E14] border-b border-[#2C2B29] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm tracking-wider uppercase font-semibold ${
                activeTab === link.id
                  ? (isAdmin ? 'text-red-400 font-bold' : 'text-[#E5A93C]')
                  : 'text-gray-300'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Customer only options in mobile drawer */}
          {!isAdmin && (
            <>
              <button
                onClick={() => {
                  onOpenAI();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-2 text-sm text-[#E5A93C]"
              >
                <Bot className="w-4 h-4" />
                <span>AI Diagnostic Assistant</span>
              </button>

              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded border border-[#E5A93C] text-[#E5A93C] text-xs font-bold uppercase tracking-wider"
              >
                <span>BOOK SERVICE</span>
                <Calendar className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Admin Sign out option in mobile drawer */}
          {isAdmin && (
            <button
              onClick={() => {
                dispatch(logout());
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 py-3 mt-2 text-red-400 text-xs font-bold uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
