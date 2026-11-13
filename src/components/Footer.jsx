import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Footer({ userTag = '@claude_vpn', expiryDate = '28.10.2026' }) {
  const [copied, setCopied] = useState(false);

  const handleCopyTag = () => {
    sound.playClick();
    navigator.clipboard?.writeText(userTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="mt-auto px-6 pt-2 pb-5 flex items-end justify-between select-none">
      {/* Left: User handle with copy icon */}
      <button
        onClick={handleCopyTag}
        className="group flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
        title="Нажмите, чтобы скопировать ваш ID"
      >
        <span className="font-poppins font-bold text-sm text-zinc-400 group-hover:text-white transition-colors">
          {userTag}
        </span>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[#5B9CFF]" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        )}
      </button>

      {/* Right: Subscription Expiry */}
      <div className="flex flex-col items-end text-right">
        <span className="text-[11px] text-zinc-400 font-medium leading-tight">
          Подписка кончится
        </span>
        <span className="text-[12px] font-poppins text-zinc-300 font-bold leading-tight">
          {expiryDate}
        </span>
      </div>
    </footer>
  );
}
