import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { WorkshopCard } from '../components/WorkshopCard';
import { Workshop } from '../types';
import { mockWorkshops } from '../services/api';
import {
  Play,
  Cpu,
  ShieldCheck,
  Wrench,
  Gem,
  Leaf,
  Calendar,
  Clock,
  CheckCircle,
  Headphones,
  MapPin,
  X,
  Phone,
  Mail,
} from 'lucide-react';

interface WorkshopsPageProps {
  onBookWorkshop: (workshop: Workshop) => void;
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({
  onBookWorkshop,
}) => {
  const { workshops } = useSelector((state: RootState) => state.workshop);
  const workshopList = workshops.length > 0 ? workshops : mockWorkshops;

  const [selectedCity, setSelectedCity] = useState<string>('All Locations');
  const [detailModalWorkshop, setDetailModalWorkshop] = useState<Workshop | null>(null);

  const filteredWorkshops =
    selectedCity === 'All Locations'
      ? workshopList
      : workshopList.filter(
          (w) => w.city.toLowerCase() === selectedCity.toLowerCase()
        );

  const cities = ['All Locations', 'Bengaluru', 'Dubai', 'Mumbai', 'London'];

  return (
    <div className="pt-24 pb-20 bg-[#080B10] min-h-screen text-white">
      {/* Hero Section matching Screenshot 2 */}
      <section className="relative py-16 overflow-hidden border-b border-[#1E2535]">
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B10]/95 via-[#080B10]/85 to-[#080B10]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Tag matching Screenshot 2 */}
            <p className="text-xs uppercase tracking-[0.25em] text-[#E5A93C] font-bold mb-3">
              PRECISION. PASSION. PERFORMANCE.
            </p>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              Our <span className="gold-text-gradient">Workshops</span>
            </h1>

            {/* Description matching Screenshot 2 */}
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Step into the future of automotive care. Our state-of-the-art workshops are built for performance, precision, and perfection.
            </p>

            {/* Buttons matching Screenshot 2 */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#workshops-grid"
                className="px-6 py-3 rounded-lg bg-[#E5A93C] text-[#0A0D13] text-xs font-bold tracking-widest uppercase hover:bg-amber-400 transition-all duration-300 shadow-gold"
              >
                EXPLORE WORKSHOPS →
              </a>

              <button
                onClick={() => alert('Tour video player opening: Take a 360-degree virtual tour of AutoForge Dubai Superhub!')}
                className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-300"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#E5A93C]" />
                <span>WATCH TOUR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workshops Section matching Screenshot 2 */}
      <section id="workshops-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Our State-of-the-Art Workshops
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Advanced facilities. Expert technicians. Exceptional care for your vehicle.
            </p>
          </div>

          {/* Location filter dropdown matching Screenshot 2 */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#121722] border border-[#21293A] text-xs text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#E5A93C] cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Layout: Cards on Left + Workshop Excellence on Right matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Workshop Cards Grid (2 cols on desktop) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id}
                workshop={workshop}
                onSelect={(wks) => setDetailModalWorkshop(wks)}
                onBookAtWorkshop={(wks) => onBookWorkshop(wks)}
              />
            ))}
          </div>

          {/* Workshop Excellence Panel matching Screenshot 2 */}
          <div className="rounded-2xl bg-[#0F141F] border border-[#232B3C] p-6 lg:p-7 h-fit">
            <h3 className="text-lg font-bold font-serif text-[#E5A93C] mb-6">
              Workshop Excellence
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#181F2F] border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Advanced Diagnostics
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    AI-powered tools for precision fault detection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#181F2F] border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Certified Technicians
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Factory-trained experts you can trust
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#181F2F] border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Premium Equipment
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Latest tools from global leaders
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#181F2F] border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Quality Parts & Materials
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    OEM & high-performance parts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#181F2F] border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Safety & Sustainability
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Environment-conscious workshop standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner matching Screenshot 2 */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left card: Book a Workshop Service */}
          <div className="md:col-span-2 rounded-2xl bg-[#0F141F] border border-[#232B3C] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-white mb-1">
                Book a Workshop Service
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Schedule your service with ease.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  Real-time Slot Availability
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                  Quick & Secure Booking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#E5A93C]" />
                  Service Reminders & Updates
                </span>
              </div>
            </div>

            <button
              onClick={() => onBookWorkshop(workshopList[0])}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs tracking-wider uppercase hover:bg-amber-400 transition-all shadow-gold"
            >
              <span>BOOK SERVICE NOW</span>
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          {/* Right card: Need Assistance? */}
          <div className="rounded-2xl bg-[#0F141F] border border-[#232B3C] p-6 sm:p-7 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-[#181F2F] border border-[#E5A93C]/40 text-[#E5A93C] shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Need Assistance?</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Our experts are here to help you.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => alert('AutoForge 24/7 Concierge Hotline: +1 (800) 555-AUTO or contact support@autoforge.com')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#2B3549] hover:border-[#E5A93C] text-xs font-semibold text-gray-200 hover:text-white transition-colors uppercase tracking-wider"
              >
                <span>CONTACT SUPPORT</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Details Modal */}
      {detailModalWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0F141F] border border-[#232B3C] shadow-2xl p-6 sm:p-8 text-white">
            <button
              onClick={() => setDetailModalWorkshop(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#E5A93C] font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>{detailModalWorkshop.city}, {detailModalWorkshop.country}</span>
            </div>

            <h3 className="text-2xl font-bold font-serif text-white mb-2">
              {detailModalWorkshop.name}
            </h3>

            <p className="text-xs text-gray-400 mb-4">{detailModalWorkshop.address}</p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#141A26] border border-[#232B3C] mb-6 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Service Capacity</span>
                <span className="font-bold text-white">{detailModalWorkshop.baysCount} Active Hoist Bays</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Technician Team</span>
                <span className="font-bold text-white">{detailModalWorkshop.techniciansCount}+ Factory Certified</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Contact Phone</span>
                <span className="font-mono text-gray-300">{detailModalWorkshop.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Operating Hours</span>
                <span className="text-gray-300">{detailModalWorkshop.operatingHours}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-[#E5A93C] uppercase tracking-wider mb-2">
                Hub Amenities & Capabilities:
              </h4>
              <div className="flex flex-wrap gap-2">
                {detailModalWorkshop.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded bg-[#181F2F] border border-[#2B3549] text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2638]">
              <button
                onClick={() => setDetailModalWorkshop(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onBookWorkshop(detailModalWorkshop);
                  setDetailModalWorkshop(null);
                }}
                className="px-6 py-2.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold hover:bg-amber-400 transition-colors"
              >
                Book Service at this Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

