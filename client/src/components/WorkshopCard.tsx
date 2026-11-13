import React from 'react';
import { Workshop } from '../types';
import { MapPin, Warehouse, Users, Award, ArrowRight } from 'lucide-react';

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  onBookAtWorkshop: (workshop: Workshop) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  onSelect,
  onBookAtWorkshop,
}) => {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0F141F] border border-[#232B3C] hover:border-[#E5A93C]/50 transition-all duration-300 shadow-xl hover:shadow-[0_12px_35px_-8px_rgba(229,169,60,0.18)]">
      {/* Workshop Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-900">
        <img
          src={workshop.image}
          alt={`${workshop.city} Workshop`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141F] via-transparent to-black/30" />
        
        {/* City Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0E14]/80 backdrop-blur-md border border-[#E5A93C]/40 text-[#E5A93C] text-[11px] font-bold tracking-widest uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>{workshop.city}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold">
          ★ {workshop.rating.toFixed(1)}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-sans mb-3 group-hover:text-[#E5A93C] transition-colors">
            {workshop.name}
          </h3>

          <div className="space-y-2.5 text-xs text-gray-300">
            {/* Bays and Technicians */}
            <div className="flex items-center gap-3 text-gray-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-[#E5A93C]" />
                {workshop.baysCount} Bays
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
                {workshop.techniciansCount}+ Technicians
              </span>
            </div>

            {/* Specialization */}
            <div className="flex items-center gap-1.5 text-gray-400">
              <Award className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
              <span className="truncate">{workshop.specialization}</span>
            </div>
          </div>
        </div>

        {/* Action button matching Screenshot 2 */}
        <div className="mt-6 pt-4 border-t border-[#1E2638] flex items-center justify-between">
          <button
            onClick={() => onSelect(workshop)}
            className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
          >
            <span>VIEW DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onBookAtWorkshop(workshop)}
            className="text-[11px] font-semibold text-gray-400 hover:text-white uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-white/10 transition-colors"
          >
            Select Hub
          </button>
        </div>
      </div>
    </div>
  );
};

