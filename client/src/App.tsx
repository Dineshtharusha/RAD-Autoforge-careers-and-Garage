import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal, AuthMode } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { Home } from './pages/Home';
import { ServicesPage } from './pages/ServicesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { CareersPage } from './pages/CareersPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CarrierPage } from './pages/CarrierPage';
import { Service, Workshop } from './types';
import { ShieldCheck, Award, Zap, Globe, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

  // Default to admin dashboard if logged in as admin, else home
  const [activeTab, setActiveTab] = useState<string>(isAdmin ? 'admin-overview' : 'home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [resetToken, setResetToken] = useState<string>('');
  const [verifyToken, setVerifyToken] = useState<string>('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [presetService, setPresetService] = useState<Service | null>(null);
  const [presetWorkshop, setPresetWorkshop] = useState<Workshop | null>(null);

  // Check for email verification or password reset tokens in URL query params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vToken = params.get('verifyToken');
      const rToken = params.get('resetToken');

      if (vToken) {
        setVerifyToken(vToken);
        setAuthMode('verify-email');
        setAuthModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (rToken) {
        setResetToken(rToken);
        setAuthMode('reset-password');
        setAuthModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      // Ignored in SSR/non-browser contexts
    }
  }, []);

  // Automatic redirection: when admin logs in, land directly on admin dashboard; when logging out, return to customer home
  useEffect(() => {
    if (isAdmin) {
      if (!activeTab.startsWith('admin')) {
        setActiveTab('admin-overview');
      }
    } else {
      if (activeTab.startsWith('admin')) {
        setActiveTab('home');
      }
    }
  }, [isAdmin]);

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleBookService = (service?: Service) => {
    if (service) setPresetService(service);
    setBookingModalOpen(true);
  };

  const handleBookWorkshop = (workshop: Workshop) => {
    setPresetWorkshop(workshop);
    setBookingModalOpen(true);
  };

  const handleBookFromAI = (serviceName: string) => {
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-gray-100 flex flex-col font-sans selection:bg-[#E5A93C] selection:text-[#080B10]">
      {/* Top Fixed Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenBooking={() => setBookingModalOpen(true)}
        onOpenAI={() => setAiModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Admin Dashboard - Rendered for all admin- prefixed tabs */}
        {activeTab.startsWith('admin') && (
          <AdminDashboard activeSection={activeTab} />
        )}

        {/* Customer Only Pages (Hidden when Admin is Active) */}
        {!isAdmin && activeTab === 'home' && (
          <Home
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookService={handleBookService}
            onBookWorkshop={handleBookWorkshop}
            onOpenAI={() => setAiModalOpen(true)}
          />
        )}

        {!isAdmin && activeTab === 'services' && (
          <ServicesPage
            onBookService={handleBookService}
            onOpenAI={() => setAiModalOpen(true)}
          />
        )}

        {!isAdmin && activeTab === 'workshops' && (
          <WorkshopsPage onBookWorkshop={handleBookWorkshop} />
        )}

        {!isAdmin && activeTab === 'careers' && (
          <CareersPage
            onBookServiceClick={() => setBookingModalOpen(true)}
            onExploreServicesClick={() => setActiveTab('services')}
          />
        )}

        {!isAdmin && activeTab === 'my-bookings' && (
          <MyBookingsPage
            onOpenBooking={() => setBookingModalOpen(true)}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {!isAdmin && activeTab === 'carrier' && <CarrierPage />}

        {!isAdmin && activeTab === 'about' && (
          <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E5A93C]">
                ABOUT AUTOFORGE
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold">
                Pioneering the Standard of Automotive Excellence
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                Founded with a conviction that exceptional vehicles require precision engineering, transparent service, and elite technician mastery. AutoForge bridges world-class workshop services with industry-defining career development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] text-center space-y-3">
                <ShieldCheck className="w-10 h-10 text-[#E5A93C] mx-auto" />
                <h3 className="text-lg font-bold font-serif text-white">Factory Master Certified</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every technician undergoes rigorous continuous training on OEM telemetry diagnostic scanners and high-voltage powertrains.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] text-center space-y-3">
                <Zap className="w-10 h-10 text-[#E5A93C] mx-auto" />
                <h3 className="text-lg font-bold font-serif text-white">Rapid Modern Architecture</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Built on the MERN stack with 100% TypeScript, Redux state management, and real-time bay availability scheduling.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#0F141F] border border-[#232B3C] text-center space-y-3">
                <Globe className="w-10 h-10 text-[#E5A93C] mx-auto" />
                <h3 className="text-lg font-bold font-serif text-white">Regional Superhub Network</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Spanning Galle, Hikkaduwa, and Ambalangoda with climate-controlled bays, dyno testing labs, and luxury lounges.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setResetToken('');
          setVerifyToken('');
        }}
        initialMode={authMode}
        resetToken={resetToken}
        verifyToken={verifyToken}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setPresetService(null);
          setPresetWorkshop(null);
        }}
        selectedServicePreset={presetService}
        selectedWorkshopPreset={presetWorkshop}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      <AIConsultantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onBookServicePreset={handleBookFromAI}
      />

      {/* Footer - ONLY FOR CUSTOMERS (Hides when Admin is logged in to keep console clean) */}
      {!isAdmin && <Footer />}
    </div>
  );
};

export default App;
