import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export default function CenterPowerButton({ status, onToggle, activeServer, killSwitchEnabled }) {
  // status: 'disconnected' | 'connecting' | 'connected'

  const handleClick = () => {
    sound.playClick();
    onToggle();
  };

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Outer ambient glow disc with #5B9CFF accent */}
      <div
        className={`w-[226px] h-[226px] rounded-full flex items-center justify-center transition-all duration-700 relative ${
          isConnected
            ? 'bg-gradient-to-b from-[#172a4c] via-[#101d36] to-[#0c1527] shadow-[0_0_80px_rgba(91,156,255,0.5)]'
            : isConnecting
            ? 'bg-gradient-to-b from-[#13223d] to-[#0c1626] shadow-[0_0_40px_rgba(91,156,255,0.25)]'
            : 'bg-gradient-to-b from-[#151f33] via-[#111726] to-[#0d121e] shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Animated ripple wave when connecting or connected */}
        {isConnected && (
          <div className="absolute inset-0 rounded-full border border-[#5B9CFF]/30 animate-ripple-wave pointer-events-none" />
        )}
        {isConnecting && (
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5B9CFF]/60 spin-connecting pointer-events-none" />
        )}

        {/* Center Clickable Power Button */}
        <button
          onClick={handleClick}
          disabled={isConnecting}
          aria-label={isConnected ? 'Отключить туннель' : 'Подключить туннель'}
          className={`w-[190px] h-[190px] rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer outline-none focus:outline-none relative group ${
            isConnected
              ? 'bg-gradient-to-b from-[#162746] to-[#0e192e] border-2 border-[#5B9CFF] shadow-[inset_0_2px_14px_rgba(91,156,255,0.4),0_0_35px_rgba(91,156,255,0.4)]'
              : isConnecting
              ? 'bg-[#10192a] border-2 border-[#5B9CFF]/50'
              : 'bg-gradient-to-b from-[#141d2d] to-[#0e1420] border border-[#5B9CFF]/25 hover:border-[#5B9CFF]/55 hover:shadow-[0_0_25px_rgba(91,156,255,0.2)]'
          }`}
        >
          {/* Centered Clean Power Symbol SVG */}
          <div className="relative transition-transform duration-300 group-hover:scale-105">
            <svg
              className={`w-16 h-16 transition-all duration-300 ${
                isConnected
                  ? 'text-[#5B9CFF] filter drop-shadow-[0_0_14px_rgba(91,156,255,0.95)]'
                  : isConnecting
                  ? 'text-[#5B9CFF] animate-pulse'
                  : 'text-[#5B9CFF] filter drop-shadow-[0_0_8px_rgba(91,156,255,0.6)] opacity-90 group-hover:opacity-100'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </div>

          {/* Mini kill switch badge at bottom of button */}
          {isConnected && killSwitchEnabled && (
            <div className="absolute bottom-4 flex items-center space-x-1 text-[9px] text-[#5B9CFF]/90 font-mono tracking-tight bg-[#5B9CFF]/10 px-2 py-0.5 rounded-full border border-[#5B9CFF]/20">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>KILL SWITCH</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
