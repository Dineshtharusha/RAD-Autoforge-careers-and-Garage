import React from 'react';
import { Service, Workshop } from '../types';
import { mockServices, mockWorkshops } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { WorkshopCard } from '../components/WorkshopCard';
import {
  Wrench,
  Calendar,
  GraduationCap,
  Users,
  Building2,
  Star,
  TrendingUp,
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onBookService: (service?: Service) => void;
  onBookWorkshop: (workshop: Workshop) => void;
  onOpenAI: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onBookService,
  onBookWorkshop,
  onOpenAI,
}) => {
  const featuredServices = mockServices.slice(0, 3);
  const featuredWorkshops = mockWorkshops.slice(0, 3);

  return (
    <div className="pt-20 bg-[#080B10] text-white">
      {/* Hero Section matching Screenshot 4 / 1 */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#1E2535]">
        {/* Cinematic dark garage hero background */}
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B10]/90 via-[#080B10]/75 to-[#080B10]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181F2F] border border-[#E5A93C]/40 text-[#E5A93C] text-xs font-bold tracking-widest uppercase mb-6 shadow-gold">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping" />
            <span>PRECISION. PASSION. PERFORMANCE.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Build Your Future in <br />
            <span className="gold-text-gradient">Automotive Excellence</span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Expert garage services and vehicle career opportunities. Drive your passion. Forge your legacy with the world's most advanced automotive network.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onBookService()}
              className="px-8 py-4 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-gold"
            >
              BOOK A SERVICE NOW →
            </button>

            <button
              onClick={() => onNavigate('careers')}
              className="px-8 py-4 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#2B3549] text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              EXPLORE CAREERS
            </button>

            <button
              onClick={onOpenAI}
              className="px-6 py-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
            >
              <Bot className="w-4 h-4 text-[#E5A93C]" />
              <span>AI DIAGNOSTIC BOT</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Core Highlight Cards matching Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => onNavigate('careers')}
            className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5 group-hover:border-[#E5A93C] group-hover:shadow-gold transition-all">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-[#E5A93C] transition-colors">
                Technician Roles
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Join our team of elite technicians and build a career working on high-end vehicles.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              View Opportunities →
            </span>
          </div>

          <div
            onClick={() => onBookService()}
            className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5 group-hover:border-[#E5A93C] group-hover:shadow-gold transition-all">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-[#E5A93C] transition-colors">
                Service Appointments
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Book expert service for your vehicle with our premium garage network.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              Book Now →
            </span>
          </div>

          <div
            onClick={() => onNavigate('careers')}
            className="rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181F2F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-5 group-hover:border-[#E5A93C] group-hover:shadow-gold transition-all">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-[#E5A93C] transition-colors">
                Training Programs
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Industry-leading training and certifications to accelerate your automotive career.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              View Programs →
            </span>
          </div>

        </div>
      </section>

      {/* 4 Stats Counters matching Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-2xl bg-[#0C1018] border border-[#1E2638] p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Users className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">500+</span>
              <p className="text-xs text-gray-400">Team Members</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Building2 className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">25+</span>
              <p className="text-xs text-gray-400">Premium Workshops</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Star className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">98%</span>
              <p className="text-xs text-gray-400">Client Satisfaction</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <TrendingUp className="w-9 h-9 text-[#E5A93C] shrink-0" />
            <div>
              <span className="text-base sm:text-lg font-bold text-white">Career Growth</span>
              <p className="text-xs text-gray-400">That Drives You Forward</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Services Section matching Screenshot 1 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-[#E5A93C]" />
              <span className="text-xs uppercase tracking-widest text-[#E5A93C] font-bold">
                EXPERTISE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Premium Garage Services
            </h2>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase hover:underline flex items-center gap-1"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onSelect={() => onNavigate('services')}
              onBook={() => onBookService(service)}
            />
          ))}
        </div>
      </section>

      {/* Superhubs Snapshot matching Screenshot 2 */}
      <section className="bg-[#06080C] border-t border-[#1C2333] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5A93C] font-bold block mb-2">
                GLOBAL NETWORK
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Our State-of-the-Art Workshops
              </h2>
            </div>

            <button
              onClick={() => onNavigate('workshops')}
              className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase hover:underline flex items-center gap-1"
            >
              <span>EXPLORE ALL HUBS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id}
                workshop={workshop}
                onSelect={() => onNavigate('workshops')}
                onBookAtWorkshop={(wks) => onBookWorkshop(wks)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Diagnostic CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-[#141A26] to-[#0F141F] border border-[#E5A93C]/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-gold">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E5A93C] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Diagnostics Integration
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Experience Instant AI Vehicle Diagnostics
            </h3>
            <p className="text-xs text-gray-400 max-w-xl">
              Type in unusual engine sounds, error codes, or symptoms to receive instant root-cause analysis, severity ratings, and labor estimates before booking.
            </p>
          </div>

          <button
            onClick={onOpenAI}
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#E5A93C] text-[#0A0D13] font-bold text-xs uppercase tracking-wider shadow-gold hover:bg-amber-400 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Diagnostic</span>
          </button>
        </div>
      </section>
    </div>
  );
};

