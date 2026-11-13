import React from 'react';
import { sound } from '../utils/audio';

export const MODES = [
  { id: 'whitelist', label: 'Вайтлист', desc: 'Туннелировать только нейросети Claude & AI' },
  { id: 'direct', label: 'Напрямую', desc: 'Прямой доступ без туннеля' },
  { id: 'blacklist', label: 'Блэклист', desc: 'Весь трафик через туннель кроме исключений' }
];

export default function ModeTabs({ activeMode, onModeChange }) {
  const handleSelect = (modeId) => {
    sound.playToggle();
    onModeChange(modeId);
  };

  return (
    <div className="px-6 mt-3 select-none">
      <div className="bg-[#1c1c1c] p-1 rounded-2xl flex items-center justify-between border border-white/[0.04]">
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              title={mode.desc}
              className={`flex-1 py-2.5 text-center rounded-xl font-bold text-[13px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#292929] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
