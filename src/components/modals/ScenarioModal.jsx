import React from 'react';
import { X, Check, SlidersHorizontal, Zap, Shield, Rocket } from 'lucide-react';
import { SCENARIOS } from '../../data/tunnelData';
import { sound } from '../../utils/audio';

export default function ScenarioModal({ isOpen, onClose, selectedScenario, onSelectScenario }) {
  if (!isOpen) return null;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#5B9CFF]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#5B9CFF]" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-[#5B9CFF]" />;
      default:
        return <SlidersHorizontal className="w-5 h-5 text-[#5B9CFF]" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 modal-backdrop flex flex-col justify-end animate-fade-in select-none">
      <div className="w-full bg-[#161719] border-t border-white/10 rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Сценарии туннелирования</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Выберите профиль оптимизации под ваши задачи
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of scenarios */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  sound.playToggle();
                  onSelectScenario(sc);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl flex items-start justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#5B9CFF]/10 border-[#5B9CFF]/50 shadow-[0_0_15px_rgba(91,156,255,0.2)]'
                    : 'bg-[#1a1b1e] border-white/5 hover:border-white/10 hover:bg-[#202227]'
                }`}
              >
                <div className="flex items-start space-x-3 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-[#132035] border border-[#5B9CFF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {renderIcon(sc.icon)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white font-poppins">
                        {sc.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5B9CFF]/15 text-[#5B9CFF] border border-[#5B9CFF]/30 font-medium">
                        {sc.badge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 mt-1">
                      {sc.description}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {sc.details}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 mt-1 ${
                    isSelected
                      ? 'bg-[#5B9CFF] border-[#5B9CFF] text-black'
                      : 'border-zinc-700 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
