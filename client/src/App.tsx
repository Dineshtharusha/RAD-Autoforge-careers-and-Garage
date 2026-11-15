import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { Home } from './pages/Home';
import { ServicesPage } from './pages/ServicesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { CareersPage } from './pages/CareersPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Service, Workshop } from './types';
import { ShieldCheck, Award, Zap, Globe, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [presetService, setPresetService] = useState<Service | null>(null);
  const [presetWorkshop, setPresetWorkshop] = useState<Workshop | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
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
        {activeTab === 'home' && (
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

        {activeTab === 'services' && (
          <ServicesPage
            onBookService={handleBookService}
            onOpenAI={() => setAiModalOpen(true)}
          />
        )}

        {activeTab === 'workshops' && (
          <WorkshopsPage onBookWorkshop={handleBookWorkshop} />
        )}

        {activeTab === 'careers' && (
          <CareersPage
            onBookServiceClick={() => setBookingModalOpen(true)}
            onExploreServicesClick={() => setActiveTab('services')}
          />
        )}

        {activeTab === 'my-bookings' && (
          <MyBookingsPage
            onOpenBooking={() => setBookingModalOpen(true)}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activeTab === 'admin' && <AdminDashboard />}

        {/* About Section */}
        {activeTab === 'about' && (
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
                <h3 className="text-lg font-bold font-serif text-white">Global Superhub Network</h3>
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
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
