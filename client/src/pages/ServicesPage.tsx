import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { ServiceCard } from '../components/ServiceCard';
import { Service } from '../types';
import { mockServices } from '../services/api';
import {
  Wrench,
  Search,
  Filter,
  Check,
  Calendar,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ServicesPageProps {
  onBookService: (service: Service) => void;
  onOpenAI: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onBookService,
  onOpenAI,
}) => {
  const { services } = useSelector((state: RootState) => state.service);
  const serviceList = services.length > 0 ? services : mockServices;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailModalService, setDetailModalService] = useState<Service | null>(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'repairs', label: 'Repairs' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'detailing', label: 'Detailing' },
    { id: 'tires', label: 'Tires' },
  ];

  const filteredServices = serviceList.filter((service) => {
    const matchesCategory =
      activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-[#080B10] min-h-screen text-white">
      {/* Hero Section matching Screenshot 1 */}
      <section className="relative py-16 overflow-hidden border-b border-[#1E2535]">
        {/* Background dark workshop image overlay */}
        <div
          className="absolute inset-0 z-0 opacity-25 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B10]/95 via-[#080B10]/80 to-[#080B10]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Tag matching Screenshot 1 */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-[#E5A93C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E5A93C] font-bold">
                OUR SERVICES
              </span>
            </div>

            {/* Title matching Screenshot 1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              Premium <br />
              <span className="gold-text-gradient">Garage Services</span>
            </h1>

            {/* Subtitle matching Screenshot 1 */}
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Expert care for every vehicle. Advanced diagnostics, precision repairs, and world-class detailing — all under one roof.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#services-catalog"
                className="px-6 py-3 rounded-lg border border-[#E5A93C] text-[#E5A93C] text-xs font-bold tracking-widest uppercase hover:bg-[#E5A93C] hover:text-[#0B0E14] transition-all duration-300 shadow-gold"
              >
                EXPLORE SERVICES →
              </a>

              <button
                onClick={onOpenAI}
                className="px-6 py-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                <span>AI SYMPTOM DIAGNOSIS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#1E2535]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-[#E5A93C] text-[#080B10] shadow-gold font-bold'
                    : 'bg-[#121722] text-gray-400 hover:text-white hover:bg-[#181F2E] border border-[#21293A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garage services..."
              className="w-full bg-[#121722] border border-[#21293A] focus:border-[#E5A93C] text-xs text-white rounded-lg pl-10 pr-4 py-2.5 outline-none"
            />
          </div>
        </div>

        {/* 6 Services Grid matching Screenshot 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onSelect={(srv) => setDetailModalService(srv)}
              onBook={(srv) => onBookService(srv)}
            />
          ))}
        </div>
      </section>

      {/* Service Detail Modal */}
      {detailModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0F141F] border border-[#232B3C] shadow-2xl p-6 sm:p-8 text-white">
            <button
              onClick={() => setDetailModalService(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5A93C] px-2.5 py-1 rounded bg-[#E5A93C]/10 border border-[#E5A93C]/30">
                {detailModalService.category}
              </span>
              <span className="text-xs text-gray-400">
                • {detailModalService.durationHours} Hours Labor
              </span>
            </div>

            <h3 className="text-2xl font-bold font-serif text-white mb-3">
              {detailModalService.name}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              {detailModalService.fullDescription}
            </p>

            {/* Features check list */}
            <div className="mb-6 p-4 rounded-xl bg-[#141A26] border border-[#232B3C]">
              <h4 className="text-xs font-bold text-[#E5A93C] uppercase tracking-wider mb-3">
                Included in this service:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailModalService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1E2638]">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Service Price</span>
                <span className="text-2xl font-bold text-[#E5A93C]">${detailModalService.price} USD</span>
              </div>

              <button
                onClick={() => {
                  onBookService(detailModalService);
                  setDetailModalService(null);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#F0BA51] to-[#E5A93C] text-[#0A0D13] font-bold text-xs tracking-wider uppercase shadow-gold hover:opacity-90 transition-all"
              >
                <span>BOOK THIS SERVICE</span>
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

