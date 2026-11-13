import React from 'react';
import { MapPin, Globe, ChevronRight, Sliders } from 'lucide-react';
import FlagIcon from './FlagIcon';
import { sound } from '../utils/audio';

export default function InfoCards({ server, scenario, isConnected, ping, onOpenLocation, onOpenScenario }) {
  const handleLocationClick = () => {
    sound.playClick();
    onOpenLocation();
  };

  const handleScenarioClick = () => {
    sound.playClick();
    onOpenScenario();
  };

  return (
    <div className="grid grid-cols-2 gap-3 px-6 select-none">
      {/* Left Card: Location */}
      <button
        onClick={handleLocationClick}
        className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-[#19191b] hover:bg-[#1e2025] border border-white/[0.05] hover:border-[#5B9CFF]/30 transition-all duration-200 text-left shadow-sm cursor-pointer"
      >
        <div className="flex flex-col space-y-1.5 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5 text-zinc-400 group-hover:text-zinc-300 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#5B9CFF] transition-colors" />
            <span className="text-[11px] font-semibold tracking-wide">Локация</span>
          </div>
          <div className="flex items-center space-x-2 truncate">
            <FlagIcon code={server.flag || server.code} className="w-5 h-3.5 rounded-sm shadow-sm flex-shrink-0" />
            <span className="text-white font-bold text-sm truncate font-poppins">
              {server.name}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#5B9CFF] group-hover:translate-x-0.5 transition-all" />
        </div>
      </button>

      {/* Right Card: Scenario */}
      <button
        onClick={handleScenarioClick}
        className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-[#19191b] hover:bg-[#1e2025] border border-white/[0.05] hover:border-[#5B9CFF]/30 transition-all duration-200 text-left shadow-sm cursor-pointer"
      >
        <div className="flex flex-col space-y-1.5 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5 text-zinc-400 group-hover:text-zinc-300 transition-colors">
            <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#5B9CFF] transition-colors" />
            <span className="text-[11px] font-semibold tracking-wide">Сценарий</span>
          </div>
          <div className="flex items-center space-x-2 truncate">
            <Sliders className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#5B9CFF] transition-colors flex-shrink-0" />
            <span className="text-white font-bold text-sm truncate">
              {scenario.name}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#5B9CFF] group-hover:translate-x-0.5 transition-all" />
        </div>
      </button>
    </div>
  );
}
