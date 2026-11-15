import React from 'react';
import { ShieldCheck, Award, Clock, FileCheck2, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090E] border-t border-[#1C2333] text-gray-400">
      {/* Top Value Badges matching Screenshot 1 */}
      <div className="border-b border-[#1C2333]/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141A26] border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Certified Technicians
                </h4>
                <p className="text-[11px] text-gray-400">Factory-trained professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141A26] border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Premium Quality
                </h4>
                <p className="text-[11px] text-gray-400">Only the best parts & products</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141A26] border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Fast & Reliable
                </h4>
                <p className="text-[11px] text-gray-400">Efficient service you can count on</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141A26] border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Warranty Assured
                </h4>
                <p className="text-[11px] text-gray-400">Backed by our solid warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[#161B26] border border-[#E5A93C] text-[#E5A93C] font-serif font-black text-lg">
                AF
              </div>
              <span className="text-lg font-bold text-white font-serif tracking-wider">
                AutoForge
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Precision garage engineering and world-class automotive career pathways. Setting new benchmarks across luxury, performance, and electric vehicle service.
            </p>
            <div className="text-xs text-amber-300 font-semibold">
              Global Support: support@autoforge.com
            </div>
          </div>

          {/* Garage Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] mb-4">
              Garage Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">High-Performance Oil Change</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Ceramic Brake Upgrades</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">OEM Telemetry Diagnostics</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Ceramic Coating & Detailing</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Dyno Tuning & Engine Rebuild</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Road-Force Wheel Balancing</span></li>
            </ul>
          </div>

          {/* Careers & Programs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] mb-4">
              Careers & Academy
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Master Diagnostic Technician</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">High-Performance Engine Tuner</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">EV High-Voltage Specialist</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Apprenticeship Programs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Global Workshop Relocation</span></li>
            </ul>
          </div>

          {/* Global Superhubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] mb-4">
              Workshop Network
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>📍 <strong className="text-white">Galle</strong> — Fort Coastal Superhub</li>
              <li>📍 <strong className="text-white">Hikkaduwa</strong> — Beachway Performance Bay</li>
              <li>📍 <strong className="text-white">Ambalangoda</strong> — Southern Tech Center</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#1C2333] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 AutoForge Careers & Garage. Rapid Application Development (RAD) Capstone Project.</p>
          <p className="mt-2 sm:mt-0 text-[#E5A93C]/80">Designed with Full Stack MERN + TypeScript</p>
        </div>
      </div>
    </footer>
  );
};

