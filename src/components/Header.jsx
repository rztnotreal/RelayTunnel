import React, { useState } from 'react';
import { Minus, X, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Header({ isConnected, isOnline = true }) {
  const [minimized, setMinimized] = useState(false);
  const [showExitNotice, setShowExitNotice] = useState(false);

  const handleMinimize = (e) => {
    e.stopPropagation();
    sound.playClick();
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage({ action: 'minimize' });
    } else {
      setMinimized(true);
      setTimeout(() => setMinimized(false), 1400);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    sound.playClick();
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage({ action: 'close' });
    } else {
      setShowExitNotice(true);
      setTimeout(() => setShowExitNotice(false), 2400);
    }
  };

  const handleDrag = () => {
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage({ action: 'drag' });
    }
  };

  return (
    <header
      onMouseDown={handleDrag}
      className="relative flex items-center justify-between px-6 pt-5 pb-2.5 select-none cursor-default"
    >
      {/* Brand Logo with exact logo from user image */}
      <div className="flex items-center space-x-2.5 group">
        <div className="flex items-center space-x-1.5">
          <img
            src="/logo.png"
            alt="RelayTunnel"
            className="h-5 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(91,156,255,0.4)]"
            onError={(e) => {
              // Fallback text if image doesn't render
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-baseline space-x-1">
            <span className="font-extrabold text-lg text-white font-poppins">Relay</span>
            <span className="font-extrabold text-lg text-[#5B9CFF] font-poppins drop-shadow-[0_0_10px_rgba(91,156,255,0.6)]">Tunnel</span>
          </div>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex items-center space-x-1 text-zinc-400">
        <button
          onClick={handleMinimize}
          title="Свернуть"
          aria-label="Свернуть"
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus className="w-3.5 h-3.5 stroke-[2.4]" />
        </button>
        <button
          onClick={handleClose}
          title="Закрыть"
          aria-label="Закрыть"
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-red-400 hover:bg-red-500/15 transition-colors"
        >
          <X className="w-3.5 h-3.5 stroke-[2.4]" />
        </button>
      </div>

      {/* Mini notification toasts */}
      {minimized && (
        <div className="absolute top-14 right-5 px-3 py-1.5 bg-[#1e1e1e] border border-[#5B9CFF]/30 rounded-xl text-xs text-zinc-300 shadow-2xl flex items-center space-x-2 animate-fade-in z-30">
          <span className="w-2 h-2 rounded-full bg-[#5B9CFF]"></span>
          <span>Приложение свернуто в системный трей</span>
        </div>
      )}
      {showExitNotice && (
        <div className="absolute top-14 right-5 px-3 py-1.5 bg-[#1e1e1e] border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-2xl flex items-center space-x-2 animate-fade-in z-30">
          <Shield className="w-3.5 h-3.5 text-[#5B9CFF]" />
          <span>Kill Switch и туннель активны в фоне</span>
        </div>
      )}
    </header>
  );
}
