import React from 'react';
import { X, Flame, Award, CheckCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

export default function StreakModal({ isOpen, onClose, streakDays = 14 }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 modal-backdrop flex flex-col justify-end animate-fade-in select-none">
      <div className="w-full bg-[#161719] border-t border-white/10 rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>Серия защиты Claude</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Дней без единой утечки реального IP в системы безопасности AI
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

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Main streak banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-[#5B9CFF]/10 to-transparent border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Непрерывная защита
              </span>
              <div className="text-3xl font-black text-white font-poppins flex items-baseline space-x-2">
                <span>{streakDays}</span>
                <span className="text-base font-medium text-[#5B9CFF]">дней подряд</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Ваш рабочий аккаунт Claude ни разу не был скомпрометирован
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#5B9CFF]/20 border border-[#5B9CFF]/30 flex items-center justify-center">
              <Award className="w-8 h-8 text-[#5B9CFF]" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5">
              <div className="text-xs text-zinc-400">Защищено AI запросов</div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                4,892
              </div>
              <div className="text-[10px] text-[#5B9CFF] font-medium mt-0.5">
                Claude 3.5 Sonnet & API
              </div>
            </div>

            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5">
              <div className="text-xs text-zinc-400">Kill Switch спас</div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                12 утечек
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                Трафик был мгновенно отсечен
              </div>
            </div>
          </div>

          {/* Protection perks list */}
          <div className="p-3.5 bg-[#1e2024] rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-zinc-300">
              Гарантии чистого туннеля:
            </div>
            {[
              'Стабильный Residential IP без смены локации во время диалога',
              'Полная маскировка TLS фингерпринта браузера (JA3/JA4)',
              'Отсутствие проверок Cloudflare Turnstile при входе'
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-zinc-300">
                <CheckCircle className="w-3.5 h-3.5 text-[#5B9CFF] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
