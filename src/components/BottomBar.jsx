import React from 'react';
import { Flame, Settings } from 'lucide-react';
import { sound } from '../utils/audio';

export default function BottomBar({
  isConnected,
  ping,
  streakDays = 14,
  onOpenStats,
  onOpenStreak,
  onOpenSettings
}) {
  const handleStatsClick = () => {
    sound.playClick();
    onOpenStats();
  };

  const handleStreakClick = () => {
    sound.playClick();
    onOpenStreak();
  };

  const handleSettingsClick = () => {
    sound.playClick();
    onOpenSettings();
  };

  return (
    <div className="grid grid-cols-3 gap-2.5 px-6 mt-3.5 select-none">
      {/* 1. Signal / Ping button */}
      <button
        onClick={handleStatsClick}
        className="flex items-center justify-center space-x-1.5 py-3 px-2 rounded-2xl bg-[#19191b] hover:bg-[#1e2025] border border-white/[0.05] hover:border-[#5B9CFF]/30 transition-all text-[13px] font-bold text-zinc-300 hover:text-white cursor-pointer group shadow-sm active:scale-95"
        title="Пинг и состояние сети"
      >
        <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#5B9CFF] transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="16" width="3.5" height="6" rx="1" />
          <rect x="8.5" y="11" width="3.5" height="11" rx="1" />
          <rect x="15" y="6" width="3.5" height="16" rx="1" />
          <rect x="21.5" y="2" width="2" height="20" rx="1" className={isConnected ? "text-[#5B9CFF]" : "opacity-30"} />
        </svg>
        <span className="font-mono text-zinc-300">
          {isConnected ? `${ping} ms` : '—'}
        </span>
      </button>

      {/* 2. Streak / Days button */}
      <button
        onClick={handleStreakClick}
        className="flex items-center justify-center space-x-1.5 py-3 px-2 rounded-2xl bg-[#19191b] hover:bg-[#1e2025] border border-white/[0.05] hover:border-[#5B9CFF]/30 transition-all text-[13px] font-bold text-zinc-300 hover:text-white cursor-pointer group shadow-sm active:scale-95"
        title="Дней непрерывной защиты Claude"
      >
        <Flame className="w-4 h-4 text-orange-400 group-hover:text-[#5B9CFF] transition-colors" />
        <span className="font-poppins">
          {isConnected ? `${streakDays} дней` : '0 дней'}
        </span>
      </button>

      {/* 3. Settings button */}
      <button
        onClick={handleSettingsClick}
        className="flex items-center justify-center space-x-1.5 py-3 px-2 rounded-2xl bg-[#19191b] hover:bg-[#1e2025] border border-white/[0.05] hover:border-[#5B9CFF]/30 transition-all text-[13px] font-bold text-zinc-300 hover:text-white cursor-pointer group shadow-sm active:scale-95"
        title="Настройки туннеля и Kill Switch"
      >
        <Settings className="w-4 h-4 text-zinc-400 group-hover:text-[#5B9CFF] group-hover:rotate-45 transition-all" />
        <span>Настройки</span>
      </button>
    </div>
  );
}
