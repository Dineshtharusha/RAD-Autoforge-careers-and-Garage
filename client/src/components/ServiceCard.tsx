import React from 'react';
import { Service } from '../types';
import {
  Droplet,
  Disc,
  Activity,
  Sparkles,
  Cpu,
  CircleDot,
  Wrench,
  ArrowRight,
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onBook,
}) => {
  // Map icon name to Lucide icons
  const renderIcon = (name: string) => {
    const iconClass = "w-7 h-7 text-[#E5A93C]";
    switch (name.toLowerCase()) {
      case 'oil change':
      case 'droplet':
        return <Droplet className={iconClass} />;
      case 'brake service':
      case 'disc':
        return <Disc className={iconClass} />;
      case 'diagnostics':
      case 'activity':
      case 'cpu':
        return <Activity className={iconClass} />;
      case 'detailing':
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'engine repair':
      case 'settings':
        return <Cpu className={iconClass} />;
      case 'tire services':
      case 'circledot':
        return <CircleDot className={iconClass} />;
      default:
        return <Wrench className={iconClass} />;
    }
  };

  return (
    <div
      onClick={() => onSelect(service)}
      className="group relative flex flex-col justify-between p-7 rounded-2xl bg-[#0F141F]/85 border border-[#232B3C] hover:border-[#E5A93C]/60 hover:bg-[#121927] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_-5px_rgba(229,169,60,0.18)]"
    >
      {/* Top Section */}
      <div>
        {/* Glowing Circular Icon matching Screenshot 1 */}
        <div className="relative mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-[#181F2F] border border-[#E5A93C]/40 group-hover:border-[#E5A93C] group-hover:shadow-[0_0_20px_rgba(229,169,60,0.35)] transition-all duration-300">
          <div className="absolute inset-1 rounded-full border border-[#E5A93C]/20" />
          {renderIcon(service.name || service.iconName)}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold tracking-wider text-white uppercase font-sans mb-2 group-hover:text-[#E5A93C] transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
          {service.shortDescription}
        </p>
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E2638]">
        <span className="text-xs font-bold text-[#E5A93C] tracking-widest uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
          LEARN MORE <ArrowRight className="w-3.5 h-3.5" />
        </span>

        <span className="text-xs font-semibold text-gray-400">
          From <span className="text-white font-bold">${service.price}</span>
        </span>
      </div>
    </div>
  );
};

